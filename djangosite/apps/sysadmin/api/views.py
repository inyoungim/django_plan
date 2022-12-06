import cx_Oracle
from django.forms import model_to_dict
from django.http import JsonResponse
from rest_framework import serializers, exceptions
from rest_framework.decorators import api_view
from ..models import UserCustomDivision
from ...common.inspectdb_model import ViewIamUserInfo, LgeimOrganization


def get_info(org_code):
    if "@" in org_code:
        user = ViewIamUserInfo.objects.using('cm').get(EMAIL=org_code)
        if user.JIKWI_NAME_ENG is None:
            user.JIKWI_NAME_ENG = user.JIKWI_NAME
        row = []
        row.append(user.EMPLOYEE_NUMBER)
        row.append(user.EMAIL)
        row.append(user.FULL_NAME)
        row.append(user.JIKWI_NAME)
        row.append(user.OLD_ORG_NAME)
        row.append(user.NAME_ENG)
        row.append(user.JIKWI_NAME_ENG)
        row.append(user.ORGAN_NAME_ENG)
        return row
    else:
        try:
            org = LgeimOrganization.objects.using('cm').get(ORGAN=org_code)
            row = []
            row.append(org.ORGAN)
            row.append(org.OLD_ORGAN_NAME)
            row.append(org.HIGHER_ORGAN)
            row.append(org.ORG_ENG_NAME)
        except:
            row = []
            row.append(org_code)
            row.append(org_code)
            row.append(org_code)
            row.append(org_code)
        return row


# UserCustomDivision Class 의 Queryset 을 serializer 하기 위한 class 선언 : 필수
class UserCustomDivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCustomDivision
        fields = '__all__'


def index(request,site ):
    active_page = int(request.GET.get('active_page', 1))  # request.GET['active_page']
    page_num = int(request.GET.get('page_num', 10))  # request.GET['page_num']
    search_text = request.GET.get('search_text', '')  # request.GET['search_text']

    # 조건에 맞는 data 갯수, page list 조회
    if search_text != "":
        if request.preset["user_lang"] == "kr":
            all_data = UserCustomDivision.objects.using(site).filter(org_name__contains=search_text)
            total_article = all_data.count()
        else:
            all_data = UserCustomDivision.objects.using(site).filter(org_name_en__contains=search_text)
            total_article = all_data.count()
    else:
        all_data = UserCustomDivision.objects.using(site).all()
        total_article = all_data.count()
    total_page = (total_article // page_num) + 1
    if total_article % page_num == 0:
        total_page -= 1

    page_block = active_page // 5
    if active_page % 5 == 0: page_block -= 1
    previous_page = page_block * 5
    next_page = previous_page + 6
    if next_page > total_page:
        next_page = total_page
    if active_page > next_page:
        previous_page = 0
        active_page = 1

    page_list = []
    page_s = previous_page + 1
    while page_s <= next_page:
        page_list.append(page_s)
        page_s += 1
        if page_s > previous_page + 5: break
    if next_page in page_list:
        next_page = 0

    start_num = (active_page - 1) * page_num
    if start_num < 0:
        start_num = 0

    if search_text != '':
        if request.preset["user_lang"] == "kr":
            db_data = UserCustomDivision.objects.using(site).filter(org_name__contains=search_text).order_by('-order_no')[start_num: start_num + page_num]
        else:
            db_data = UserCustomDivision.objects.using(site).filter(org_name_en__contains=search_text).order_by('-order_no')[start_num: start_num + page_num]
    else:
        db_data = UserCustomDivision.objects.using(site).all().order_by('-order_no')[start_num: start_num + page_num]

    # queryset 결과를 list 형태로 serializer 하려면 many=True 옵션을 사용
    serializer = UserCustomDivisionSerializer(db_data, many=True)

    data = {
        "data_list": serializer.data,
        "page_list": page_list,
        "previous_page": previous_page,
        "active_page": active_page,
        "next_page": next_page,
        "total_article": total_article,
        "search_text":search_text,
    }
    return JsonResponse(data, safe=False)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def detail(request,site , pk):
    if request.method == "GET":  # load (view, modify)
        db_data = UserCustomDivision.objects.using(site).get(id=pk)
        data = { "id":db_data.id, "div_name":db_data.div_name, "order_no":db_data.order_no }

        more_info = get_info(db_data.org_code)
        if '@' in db_data.org_code:
            data["targetType"] = "USER"

            data["EMAIL"] = more_info[1]
            data["FULL_NAME"] = more_info[2]
            data["JIKWI_NAME"] = more_info[3]
            data["OLD_ORG_NAME"] = more_info[4]

            data["NAME_ENG"] = more_info[5]
            data["JIKWI_NAME_ENG"] = more_info[6]
            data["ORGAN_NAME_ENG"] = more_info[7]
        elif db_data.org_code == 'Everyone':
            data["targetType"] = "OTHER"
            data["ORGAN"] = db_data.org_code
            data["OLD_ORGAN_NAME"] = db_data.org_code
            data["ORG_ENG_NAME"] = db_data.org_code
        else:
            data["targetType"] = "ORG"

            data["ORGAN"] = more_info[0]
            data["OLD_ORGAN_NAME"] = more_info[1]
            data["ORG_ENG_NAME"] = more_info[3]

        return JsonResponse(data=data, safe=False)
        # serializer = UserCustomDivisionSerializer(db_data)
        # return JsonResponse(data=serializer.data, safe=False)

    elif request.method == "POST":  # save new , pk = 0
        div_name = request.data.get('div_name', '')
        target_email = request.data.get('EMAIL', '')
        order_no = request.data.get('order_no', '0')

        if target_email == "":
            org_code = request.data.get('ORGAN', '')
            org_name = request.data.get('OLD_ORGAN_NAME', '')
            org_name_en = request.data.get('ORG_ENG_NAME', '')
        else:
            org_code = request.data.get('EMAIL', '')
            org_name = request.data.get('FULL_NAME', '')
            org_name_en = request.data.get('NAME_ENG', '')

        try:
            check_item = UserCustomDivision.objects.using(site).get(org_code=org_code)
        except:
            check_item = None
        if check_item:
            raise exceptions.ParseError("Same Target is already exists.")

        new_item = UserCustomDivision()
        new_item.order_no = order_no
        new_item.div_name = div_name.upper()
        new_item.org_code = org_code
        new_item.org_name = org_name
        new_item.org_name_en = org_name_en
        new_item.save(using=site)
        return JsonResponse(model_to_dict(new_item), safe=False)

    elif request.method == "PUT":  # save new , pk = 0
        div_name = request.data.get('div_name', '')
        order_no = request.data.get('order_no', '0')

        db_data = UserCustomDivision.objects.using(site).get(id=pk)
        db_data.order_no = order_no
        db_data.div_name = div_name.upper()
        db_data.save(using=site)

        data = {"id": db_data.id, "div_name": db_data.div_name, "order_no": db_data.order_no}

        more_info = get_info(db_data.org_code)
        if '@' in db_data.org_code:
            data["targetType"] = "USER"

            data["EMAIL"] = more_info[1]
            data["FULL_NAME"] = more_info[2]
            data["JIKWI_NAME"] = more_info[3]
            data["OLD_ORG_NAME"] = more_info[4]

            data["NAME_ENG"] = more_info[5]
            data["JIKWI_NAME_ENG"] = more_info[6]
            data["ORGAN_NAME_ENG"] = more_info[7]
        elif db_data.org_code == 'Everyone':
            data["targetType"] = "OTHER"
            data["ORGAN"] = db_data.org_code
            data["OLD_ORGAN_NAME"] = db_data.org_code
            data["ORG_ENG_NAME"] = db_data.org_code
        else:
            data["targetType"] = "ORG"

            data["ORGAN"] = more_info[0]
            data["OLD_ORGAN_NAME"] = more_info[1]
            data["ORG_ENG_NAME"] = more_info[3]

        return JsonResponse(data=data, safe=False)

    elif request.method == "DELETE":  # delete
        db_data = UserCustomDivision.objects.using(site).get(id=pk)
        db_data.delete()
        data = {}
        return JsonResponse(data, safe=False)
