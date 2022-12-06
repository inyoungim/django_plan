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
                row = ['122916', data, "이학수", "로컬 그룹", "local", "책임연구원", user_type, "123421", "HE",
                       "Lee Hak Soo", "Professional", "HE Development Planning Department", ""]
                orglist = [user_type, '280925', '280331', '148388', '12899']
                office_name, office_name_en = "HE연구소", "HE R&D Lab"
            elif data == "inyoung.lim":
                user_type = '252680'
                row = ['252680', data, "임인영", "로컬 그룹", "local", "선임연구원", user_type, "123421", "HE",
                       "Lim In Young", "Specialist", "HE Development Planning Department", ""]
                orglist = [user_type, '280925', '280331', '148388', '12899']
                office_name, office_name_en = "HE연구소", "HE R&D Lab"
            orglist.append('Everyone')
            return row, user_type, orglist, office_name, office_name_en, 'KR'
        return [], None, []


class AclCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def process_view(self, request, view_func, view_args, view_kwargs):
        div_name = view_kwargs.get('div_name', None)
        # request.path 가 /document/<int:doc_id> 일 경우 결재자 list 에 존재하면 acl = 5 로 setting
        if hasattr(request, 'preset') and '/document/' in request.path:
            doc_id = view_kwargs.get('doc_id', None)
            if doc_id and request.preset["menu_acl"] >= 10:
                app_type = request.path.split('/')[3]

                if request.preset["menu_acl"] < 3:
                    return render(request, "base/405.html", status=405)
                else:
                    return
            # doc_id 가 없는 path 는 모두 acl 5 로 fix
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
        # acl check 하지 않을 url pass
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
        # request.path 가 /cgi/ 로 시작할 경우 direct response
        if SITE.lower() == 'cgi' or request.path == '/' \
                or re.match('/download/', request.path):
            return self.get_response(request)
        if SITE not in SITE_LIST:
            return render(request, "base/404_site.html", status=404)

        # root path 에서 language 초기화 : hq --> kr, ic --> en
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

            # 초기 접속시 SITE, LANGUAGE SETTING
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
            # 개인별 Language setting
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
            request.session.set_expiry(0)  # 0 은 브라우저 닫힐때 까지, 숫자 : 초단위 , 10시간 -> 60*60*10
            request.session.clear_expired()

        elif user_type != '' and switch_user != '':
            # sysadmin 의 user switch 시 --> switch_user 로 사용자 조회
            # --> request.path 로 redirect (GET 의 parameter 제거)
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
            request.session.set_expiry(60 * 60 * 1)  # 1시간
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
            # request.path 가 api 가 아닌 일반 uri 일 경우 full menu list, acl 조회 --> menu display
            request.menuList = []  # --> menuListComponent 에서 사용
            request.menu_list = []  # --> Top, Left menu 에서 사용 (mptt 기능 활용을 위해 참고용으로 사용)
            menuPidList = []
            menu_list = NavMenu.objects.using(SITE).all()
            # menu_list 를 json 형태로 변경하여 사용할 경우 (js 에서 사용)
            # --> serializer = DataSerializer(menu_list, many=True)
            # --> request.menuList = json.dumps(serializer.data)

            for menu in menu_list:
                menu_data = DataSerializer(menu, many=False).data
                menu_data['acl'] = 9 if user_id == "admin" else menu.get_navi_path(SITE, user_org_code)[1]
                menu_data['acl_inherit'] = 1 if menu.acl_inherit else 0  # acl_inherit 는 boolean type 으로 값 0,1 로 재 설정 필요

                # '/' (Root) 메뉴는 메뉴 리스트에서 제외
                if menu.path == f'/{SITE}/':
                    request.menuList.append(menu_data)
                    menuPidList.append(menu.id)
                    continue

                # Parent Menu 가 없는 menu 는 request.menuList 에 추가하지 않음
                # --> menuPidList 에 menu.parent_id 가 없는 menu 는 제외
                if menu.parent_id in menuPidList and menu_data['acl'] > 0:  # 1 :view
                    request.menuList.append(menu_data)
                    request.menu_list.append(menu)
                    menuPidList.append(menu.id)
        else:
            request.menuList = []
            request.menu_list = []

        # request.path 에 /api/ 가 포함되어 있을 경우 /api/ 전까지 uri 로 acl 조회
        uripath = request.path.split('/api/')[0]
        if '/api/' in request.path:
            uripath += '/'

        # NavMenu 의 Root 의 ACL Inherit 가 disable 될 경우 서버 작업중 page 로 이동 (admin 만 작업 가능)
        root_menu = NavMenu.objects.using(SITE).get(level=0)
        system_locked = not root_menu.acl_inherit
        if system_locked and user_type == '':
            return render(request, "base/423.html", status=423)

        # 조회된 사용자 정보를 이용한 Menu Acl Check
        menu_name = ''
        menu_path = None
        menu_top = 0

        if (uripath == f'/{SITE}/apps/common/' or f'/{SITE}/apps/workflow/api/' in request.path or
                f'/{SITE}/apps/navMenu/api/' in request.path):
            menu_id = 0
            menu_acl = 5
            # process_view() 에서 접속자가 결재자 list 에 없을 경우 /site/apps/ 로 redirection 함
        else:
            # uripath 가 일치할 때까지 부모 path 검색
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

        # check approval document acl : __call__() function 종료 후 process_view() function 실행
        # process_view() function 에서 결재 list 에 있을 경우 menu_acl = 5 로 설정하고
        # 결재 list 에 없을 경우
        if '/document/' in request.path and menu_acl < 5:
            menu_acl += 10 # for document acl check

        if menu_acl < 0:
            return redirect(sso_url)

        # 권한에 따른 button disabled 활성화
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

        # url 이 /SITE/appid/id/?boardid= 이면 djangosite.views.py 에서 request.session['boardid'] 생성
        # redirect 된 url 이면 request.session['boardid'] 삭제
        if 'boardid' in request.session and not request.path.startswith(f"/{SITE}/appid/"):
            del request.session['boardid']

        return response
