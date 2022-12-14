import os
import re
import time

from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.db import connections
from django.shortcuts import redirect, render
from django.utils import timezone
from rest_framework import serializers

from ..common.inspectdb_model import ViewIamUserInfo
from ..navMenu.models import NavMenu
from ..sysadmin.models import UserCustomDivision


class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavMenu
        # fields = '__all__'
        fields = ['id', 'name', 'path', 'acl_inherit', 'parent_id', 'level', 'tree_id', 'lft', 'rght']


def get_user_information(data, type='empno'):
    try:
        if type == 'empno':
            user = ViewIamUserInfo.objects.using('cm').get(EMPLOYEE_NUMBER=data)
        else:
            user = ViewIamUserInfo.objects.using('cm').get(ID=data)
        if user.JIKWI_NAME_ENG is None:
            user.JIKWI_NAME_ENG = user.JIKWI_NAME
        row = []
        row.append(user.EMPLOYEE_NUMBER)
        row.append(user.ID)
        row.append(user.FULL_NAME)
        row.append(user.OLD_ORG_NAME)
        row.append(user.ORGANIZATION_ID)
        row.append(user.JIKWI_NAME)
        row.append(user.EMAIL)
        row.append(user.SUPERVISOR_NUMBER)
        row.append(user.DIVISION_CODE)
        row.append(user.NAME_ENG)
        row.append(user.JIKWI_NAME_ENG)
        row.append(user.ORGAN_NAME_ENG)
        row.append(user.MOBILE_TEL)

        orglist = [user.EMAIL]
        office_name, office_name_en, country = None, None, None
        with connections['cm'].cursor() as cursor:
            cursor.execute(f""" WITH RECURSIVE cte AS (
                    SELECT ORGAN, OLD_ORGAN_NAME, ORG_ENG_NAME, LOCATION_COUNTRY, HIGHER_ORGAN
                    FROM lgeim_organization WHERE ORGAN = '{user.ORGANIZATION_ID}'
                    UNION ALL
                    SELECT p.ORGAN, p.OLD_ORGAN_NAME, p.ORG_ENG_NAME, p.LOCATION_COUNTRY, p.HIGHER_ORGAN
                    FROM lgeim_organization p
                    INNER JOIN cte ON p.ORGAN = cte.HIGHER_ORGAN
                ) SELECT * FROM cte
            """)
            for orgcode in cursor:
                orglist.append(orgcode[0])
                country = orgcode[3]
                if len(orglist) > 2 and office_name is None:
                    office_name = orgcode[1]
                    office_name_en = orgcode[2]

        if row[6] == 'haksoo.lee@lge.com' or row[6] == 'inyoung.lim@lge.com':
            user_type = row[0]
        else:
            user_type = ''
        if row[9] is None: row[9] = row[4]

        orglist.append('Everyone')
        return row, user_type, orglist, office_name, office_name_en, country
    except:
        if settings.DEBUG:
            user_type = ''
            row = []
            orglist = []
            if data == "haksoo.lee":
                user_type = '122916'
                row = ['122916', data, "?????????", "?????? ??????", "local", "???????????????", user_type, "123421", "HE",
                       "Lee Hak Soo", "Professional", "HE Development Planning Department", ""]
                orglist = [user_type, '280925', '280331', '148388', '12899']
                office_name, office_name_en = "HE?????????", "HE R&D Lab"
            elif data == "inyoung.lim":
                user_type = '252680'
                row = ['252680', data, "?????????", "?????? ??????", "local", "???????????????", user_type, "123421", "HE",
                       "Lim In Young", "Specialist", "HE Development Planning Department", ""]
                orglist = [user_type, '280925', '280331', '148388', '12899']
                office_name, office_name_en = "HE?????????", "HE R&D Lab"
            orglist.append('Everyone')
            return row, user_type, orglist, office_name, office_name_en, 'KR'
        return [], None, []


class AclCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def process_view(self, request, view_func, view_args, view_kwargs):
        div_name = view_kwargs.get('div_name', None)
        # request.path ??? /document/<int:doc_id> ??? ?????? ????????? list ??? ???????????? acl = 5 ??? setting
        if hasattr(request, 'preset') and '/document/' in request.path:
            doc_id = view_kwargs.get('doc_id', None)
            if doc_id and request.preset["menu_acl"] >= 10:
                app_type = request.path.split('/')[3]

                if request.preset["menu_acl"] < 3:
                    return render(request, "base/405.html", status=405)
                else:
                    return
            # doc_id ??? ?????? path ??? ?????? acl 5 ??? fix
            elif not doc_id and request.preset["menu_acl"] >= 10:
                request.preset["menu_acl"] = 5
                return

        div_name = request.GET.get('div_name', None)
        if div_name and '/document/api/' not in request.path:
            div_list = request.preset["user_custom_div"].split(',')
            if div_name == "ALL":
                return

            if div_name not in div_list:
                return render(request, "base/405.html", status=405)

    def __call__(self, request):
        # acl check ?????? ?????? url pass
        if request.path in ['/favicon.ico', ]:
            response = self.get_response(request)
            return response

        # code of before response view
        sso_url = "https://sso.lge.com/eplogin.jsp?"
        sso_url += "TYPE=33554433&REALMOID=06-3d8ecda9-7458-0006-0000-703f0000703f&GUID=&SMAUTHREASON=0&METHOD=GET"
        sso_url += "&SMAGENTNAME=-SM-gFbimnoUfHFCpX4o0x%2bq3yTv6aUBx1gEPllBt6wxA96gPMmAlqwJmeOLClUK7Z3g&"
        sso_url += "TARGET=" + request.path

        user_emp_no = request.session.get('user_emp_no')
        user_id = request.session.get('user_id')
        user_mail = request.session.get('user_mail')
        user_name = request.session.get('user_name')
        user_name_en = request.session.get('user_name_en')
        user_position = request.session.get('user_position')
        user_position_en = request.session.get('user_position_en')
        user_org_name = request.session.get('user_org_name')
        user_org_name_en = request.session.get('user_org_name_en')
        user_office_name = request.session.get('user_office_name')
        user_office_name_en = request.session.get('user_office_name_en')
        user_mobile_tel = request.session.get('user_mobile_tel')
        user_org_code = request.session.get('user_org_code', [])
        user_div_code = request.session.get('user_div_code')
        user_custom_div = request.session.get('user_custom_div')
        user_type = request.session.get('user_type')
        sup_emp_no = request.session.get('sup_emp_no')
        user_lang = request.session.get('user_lang')
        site = request.session.get('site')
        switch_user = request.GET.get('su', '')
        switch_lang = request.GET.get('lang', '')

        SITE_LIST = [site for site in settings.DATABASES]
        SITE = request.path.split('/')[1].lower()
        if SITE == "": SITE = 'hq'
        # request.path ??? /cgi/ ??? ????????? ?????? direct response
        if SITE.lower() == 'cgi' or request.path == '/' \
                or re.match('/download/', request.path):
            return self.get_response(request)
        if SITE not in SITE_LIST:
            return render(request, "base/404_site.html", status=404)

        # root path ?????? language ????????? : hq --> kr, ic --> en
        if request.path == f'/{SITE}/':
            if SITE == 'hq':
                request.session['user_lang'] = "kr"
                user_lang = "kr"
            else:
                request.session['user_lang'] = "en"
                user_lang = "en"

        if user_emp_no is None:
            if settings.DEBUG:
                user_id = os.getenv('USERNAME')
                user_info, user_type, user_org_code, user_office_name, user_office_name_en, country \
                    = get_user_information(user_id, type='id')
                # EMPLOYEE_NUMBER,ID,FULL_NAME,OLD_ORG_NAME,ORGANIZATION_ID,JIKWI_NAME,EMAIL,SUPERVISOR_NUMBER,DIVISION_CODE
            else:
                # ssolgenet = "id=haksoo.lee&pw=UVoCl6f6HY9Yq5p5hMJnaA==&empno=122916&ssoid=haksoo.lee"
                ssolgenet = request.COOKIES.get('ssolgenet', '')
                po = re.compile(r'(.*)&empno=(.*)&(.*)')
                m = po.search(ssolgenet)
                # redirect sso url when do not detect ssolgnet or empno
                if m is None:
                    return redirect(sso_url)

                user_emp_no = m.group(2)
                user_info, user_type, user_org_code, user_office_name, user_office_name_en, country\
                    = get_user_information(user_emp_no, type='empno')

            if len(user_info) > 0:
                user_emp_no = user_info[0]
                user_id = user_info[1]
                user_name = user_info[2]
                user_org_name = user_info[3]
                user_position = user_info[5]
                user_mail = user_info[6]
                sup_emp_no = user_info[7]
                user_div_code = user_info[8]
                user_name_en = user_info[9]
                user_position_en = user_info[10]
                user_org_name_en = user_info[11]
                user_mobile_tel = user_info[12]

            # ?????? ????????? SITE, LANGUAGE SETTING
            if country == 'KR':
                SITE = 'hq'
                request.session['user_lang'] = "kr"
                user_lang = "kr"
            elif country == 'IN':
                SITE = 'ic'
                request.session['user_lang'] = "en"
                user_lang = "en"
            else:
                SITE = 'hq'
                request.session['user_lang'] = "en"
                user_lang = "en"
            # ????????? Language setting
            # hanCount = len(re.findall(u'[\u3130-\u318F\uAC00-\uD7A3]+', user_name))
            # user_lang = "en"
            # if hanCount > 0: user_lang = "kr"
            # request.session['user_lang'] = user_lang

            # custom division
            cdiv = UserCustomDivision.objects.using(SITE).filter(org_code__in=user_org_code).order_by('-order_no')
            if cdiv.exists():
                user_custom_div = cdiv[0].div_name
                request.session['user_custom_div'] = user_custom_div

            request.session['user_emp_no'] = user_emp_no
            request.session['user_id'] = user_id
            request.session['user_mail'] = user_mail
            request.session['user_name'] = user_name
            request.session['user_name_en'] = user_name_en
            request.session['user_position'] = user_position
            request.session['user_position_en'] = user_position_en
            request.session['user_org_name'] = user_org_name
            request.session['user_org_name_en'] = user_org_name_en
            request.session['user_office_name'] = user_office_name
            request.session['user_office_name_en'] = user_office_name_en
            request.session['user_mobile_tel'] = user_mobile_tel
            request.session['user_org_code'] = user_org_code
            request.session['user_div_code'] = user_div_code
            request.session['user_type'] = user_type
            request.session['sup_emp_no'] = sup_emp_no
            request.session['site'] = SITE
            request.session.set_expiry(0)  # 0 ??? ???????????? ????????? ??????, ?????? : ????????? , 10?????? -> 60*60*10
            request.session.clear_expired()

        elif user_type != '' and switch_user != '':
            # sysadmin ??? user switch ??? --> switch_user ??? ????????? ??????
            # --> request.path ??? redirect (GET ??? parameter ??????)
            if switch_user == user_emp_no:
                user_emp_no = 0
                user_id = "admin"
                user_name = "admin"
                user_org_name = "admin"
                user_office_name = "admin"
                user_position = "admin"
                user_name_en = "admin"
                user_position_en = "admin"
                user_org_name_en = "admin"
                user_office_name_en = "admin"
                user_mobile_tel = ""
            else:
                user_info, _, user_org_code, user_office_name, user_office_name_en, country \
                    = get_user_information(switch_user, type='empno')
                if len(user_info) > 0:
                    user_emp_no = user_info[0]
                    user_id = user_info[1]
                    user_name = user_info[2]
                    user_org_name = user_info[3]
                    user_position = user_info[5]
                    user_mail = user_info[6]
                    sup_emp_no = user_info[7]
                    user_div_code = user_info[8]
                    user_name_en = user_info[9]
                    user_position_en = user_info[10]
                    user_org_name_en = user_info[11]
                    user_mobile_tel = user_info[12]

            # custom division
            cdiv = UserCustomDivision.objects.using(SITE).filter(org_code__in=user_org_code).order_by('-order_no')
            if cdiv.exists():
                user_custom_div = cdiv[0].div_name
                request.session['user_custom_div'] = user_custom_div

            request.session['user_emp_no'] = user_emp_no
            request.session['user_id'] = user_id
            request.session['user_mail'] = user_mail
            request.session['user_name'] = user_name
            request.session['user_name_en'] = user_name_en
            request.session['user_position'] = user_position
            request.session['user_position_en'] = user_position_en
            request.session['user_org_name'] = user_org_name
            request.session['user_org_name_en'] = user_org_name_en
            request.session['user_office_name'] = user_office_name
            request.session['user_office_name_en'] = user_office_name_en
            request.session['user_mobile_tel'] = user_mobile_tel
            request.session['user_org_code'] = user_org_code
            request.session['user_div_code'] = user_div_code
            request.session['user_type'] = user_type
            request.session['sup_emp_no'] = sup_emp_no
            request.session['user_lang'] = user_lang
            request.session['site'] = SITE
            request.session.set_expiry(60 * 60 * 1)  # 1??????
            request.session.clear_expired()

            return redirect(request.path)

        elif switch_lang != '':
            if switch_lang == "en":
                request.session['user_lang'] = "kr"
            else:
                request.session['user_lang'] = "en"
            return redirect(request.path)
        elif request.path.lower() == f"/{SITE}/":
            request.session['site'] = SITE
            # custom division
            cdiv = UserCustomDivision.objects.using(SITE).filter(org_code__in=user_org_code).order_by('-order_no')
            if cdiv.exists():
                user_custom_div = cdiv[0].div_name
                request.session['user_custom_div'] = user_custom_div

        if SITE != site:
            request.session['site'] = SITE
            # custom division
            cdiv = UserCustomDivision.objects.using(SITE).filter(org_code__in=user_org_code).order_by('-order_no')
            if cdiv.exists():
                user_custom_div = cdiv[0].div_name
                request.session['user_custom_div'] = user_custom_div

        if '/api/' not in request.path:
            # request.path ??? api ??? ?????? ?????? uri ??? ?????? full menu list, acl ?????? --> menu display
            request.menuList = []  # --> menuListComponent ?????? ??????
            request.menu_list = []  # --> Top, Left menu ?????? ?????? (mptt ?????? ????????? ?????? ??????????????? ??????)
            menuPidList = []
            menu_list = NavMenu.objects.using(SITE).all()
            # menu_list ??? json ????????? ???????????? ????????? ?????? (js ?????? ??????)
            # --> serializer = DataSerializer(menu_list, many=True)
            # --> request.menuList = json.dumps(serializer.data)

            for menu in menu_list:
                menu_data = DataSerializer(menu, many=False).data
                menu_data['acl'] = 9 if user_id == "admin" else menu.get_navi_path(SITE, user_org_code)[1]
                menu_data['acl_inherit'] = 1 if menu.acl_inherit else 0  # acl_inherit ??? boolean type ?????? ??? 0,1 ??? ??? ?????? ??????

                # '/' (Root) ????????? ?????? ??????????????? ??????
                if menu.path == f'/{SITE}/':
                    request.menuList.append(menu_data)
                    menuPidList.append(menu.id)
                    continue

                # Parent Menu ??? ?????? menu ??? request.menuList ??? ???????????? ??????
                # --> menuPidList ??? menu.parent_id ??? ?????? menu ??? ??????
                if menu.parent_id in menuPidList and menu_data['acl'] > 0:  # 1 :view
                    request.menuList.append(menu_data)
                    request.menu_list.append(menu)
                    menuPidList.append(menu.id)
        else:
            request.menuList = []
            request.menu_list = []

        # request.path ??? /api/ ??? ???????????? ?????? ?????? /api/ ????????? uri ??? acl ??????
        uripath = request.path.split('/api/')[0]
        if '/api/' in request.path:
            uripath += '/'

        # NavMenu ??? Root ??? ACL Inherit ??? disable ??? ?????? ?????? ????????? page ??? ?????? (admin ??? ?????? ??????)
        root_menu = NavMenu.objects.using(SITE).get(level=0)
        system_locked = not root_menu.acl_inherit
        if system_locked and user_type == '':
            return render(request, "base/423.html", status=423)

        # ????????? ????????? ????????? ????????? Menu Acl Check
        menu_name = ''
        menu_path = None
        menu_top = 0

        if (uripath == f'/{SITE}/apps/common/' or f'/{SITE}/apps/workflow/api/' in request.path or
                f'/{SITE}/apps/navMenu/api/' in request.path):
            menu_id = 0
            menu_acl = 5
            # process_view() ?????? ???????????? ????????? list ??? ?????? ?????? /site/apps/ ??? redirection ???
        else:
            # uripath ??? ????????? ????????? ?????? path ??????
            uripath = uripath.replace('/link/', '/apps/')
            while True:
                try:
                    menu = NavMenu.objects.using(SITE).get(path__iexact=uripath)
                    navi_path_acl = menu.get_navi_path(SITE, user_org_code)
                    menu_name = menu.name
                    menu_id = menu.id
                    menu_path = navi_path_acl[0]
                    menu_acl = navi_path_acl[1]
                    menu_top = navi_path_acl[2]

                    request.session['menu_id'] = menu_id
                    request.session['menu_acl'] = menu_acl
                    break
                except:
                    uripath = '/'.join(uripath.split('/')[:-2]) + '/'

            menu_id = request.session.get('menu_id')
            menu_acl = request.session.get('menu_acl')

        request.today = timezone.localtime()  # datetime.today()
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            request.today = request.today + relativedelta(hours=-2)
        request.nextday = request.today + relativedelta(days=1)
        request.lmday = request.nextday - relativedelta(months=1)
        request.nmday = request.today + relativedelta(months=1)
        request.nyday = request.today + relativedelta(years=1)



        # force set acl for system sysadmin
        if user_id == "admin":
            menu_acl = 9

        # check approval document acl : __call__() function ?????? ??? process_view() function ??????
        # process_view() function ?????? ?????? list ??? ?????? ?????? menu_acl = 5 ??? ????????????
        # ?????? list ??? ?????? ??????
        if '/document/' in request.path and menu_acl < 5:
            menu_acl += 10 # for document acl check

        if menu_acl < 0:
            return redirect(sso_url)

        # ????????? ?????? button disabled ?????????
        view_disabled = "disabled" if menu_acl < 1 else ""
        read_disabled = "disabled" if menu_acl < 3 else ""
        write_disabled = "disabled" if menu_acl < 5 else ""
        manage_disabled = "disabled" if menu_acl < 7 else ""
        admin_disabled = "disabled" if menu_acl < 9 else ""

        # set acl value at request object
        request.preset = {
            'user_emp_no': user_emp_no,
            'user_id': user_id,
            'user_mail': user_mail,
            'user_name': user_name,
            'user_name_en': user_name_en,
            'user_position': user_position,
            'user_position_en': user_position_en,
            'user_org_name': user_org_name,
            'user_org_name_en': user_org_name_en,
            'user_office_name': user_office_name,
            'user_office_name_en': user_office_name_en,
            'user_mobile_tel': user_mobile_tel,
            'user_org_code': user_org_code,
            'user_div_code': user_div_code,
            'user_custom_div': user_custom_div,
            'user_type': user_type,
            'user_lang': user_lang,
            'sup_emp_no': sup_emp_no,

            'menu_id': menu_id,
            'menu_name': menu_name,
            'menu_path': menu_path,
            'menu_top': menu_top,
            'menu_acl': menu_acl,

            'view_disabled': view_disabled,
            'read_disabled': read_disabled,
            'write_disabled': write_disabled,
            'manage_disabled': manage_disabled,
            'admin_disabled': admin_disabled,

            'site': SITE,
            'site_list': SITE_LIST,
            'root_site': "/" + SITE + "/",
            'system_locked' : system_locked
        }

        if request.method in ('PUT', 'POST', 'DELETE') and menu_acl < 5:
            return render(request, "base/405.html", status=405)
        if request.method in ('GET') and request.path == f'/{SITE}/' and menu_acl < 1:
            return render(request, "base/405.html", status=405)
        elif request.method in ('GET') and request.path != f'/{SITE}/' and menu_acl < 3:
            return render(request, "base/405.html", status=405)

        response = self.get_response(request)
        # code of after response view

        if response.status_code == 404:
            return render(request, "base/404.html", status=404)

        # url ??? /SITE/appid/id/?boardid= ?????? djangosite.views.py ?????? request.session['boardid'] ??????
        # redirect ??? url ?????? request.session['boardid'] ??????
        if 'boardid' in request.session and not request.path.startswith(f"/{SITE}/appid/"):
            del request.session['boardid']

        return response
