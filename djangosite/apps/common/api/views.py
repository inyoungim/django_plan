import math
import re
from datetime import timedelta

from django.core.files.storage import FileSystemStorage
from django.db import connections
from django.db.models import Q
from django.http import JsonResponse, FileResponse
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.decorators import api_view

from ..inspectdb_model import ViewIamUserInfo, ViewIamUserInfoSerializer, LgeimOrganization, \
    LgeimOrganizationSerializer
from ...boards.api.views import get_detail
from ...boards.models import Board, BoardPopup, BoardAttached



def make_dict(cursor):
    column_names = [d[0] for d in cursor.description]

    def create_row(*args):
        return dict(zip(column_names, args))

    return create_row




@api_view(['GET'])
def userinfo(request, site):
    return get_user_info(request, site)


@api_view(['GET'])
def bid_userinfo(request, site, bid):
    return get_user_info(request, site)





@api_view(['GET'])
def projectSearch(request, site):
    div_name = request.GET.get('div_name', '')
    search_text = request.GET.get('search_text', '')
    #if len(search_text) < 2:
    #    raise exceptions.ParseError("Please, input more than 2 digits.")

    item_list = getProjectData(site, div_name, search_text, many=True)
    data = {"searchList": item_list}
    return JsonResponse(data, safe=False)



@api_view(['GET'])
def partSearch(request, site):
    active_page = int(request.GET.get('active_page', 1))  # request.GET['active_page']
    page_num = int(request.GET.get('page_num', 10))  # request.GET['page_num']
    search_text = request.GET.get('search_text', '')  # request.GET['search_text']
    option = request.GET.get('option', '')  # request.GET['search_text']

    # option 에 part number 포함 조건이 있을 경우 part number 포함 조건을 먼저 검사함
    part_condtion = option.split(':')
    if len(part_condtion) > 1:
        if "!=" in part_condtion[1]:
            part_char = part_condtion[1].split('=')
            part_head_list = part_char[1].split(',')
            for part_head in part_head_list:
                part_head = part_head.strip()
                if search_text.startswith(part_head):
                    if request.preset["user_lang"] == "kr":
                        raise exceptions.ParseError(f"Part number 는 '{part_head}' 로 시작할 수 없습니다.")
                    else:
                        raise exceptions.ParseError(f"Part number should not start with '{part_head}'.")
        else:
            part_char = part_condtion[1].split('=')
            part_head_list = part_char[1].split(',')
            part_include = False
            for part_head in part_head_list:
                part_head = part_head.strip()
                if search_text.startswith(part_head):
                    part_include = True
            if not part_include:
                if request.preset["user_lang"] == "kr":
                    raise exceptions.ParseError(f"Part number 는 '{part_head_list}' 로 시작해야 합니다..")
                else:
                    raise exceptions.ParseError(f"Part number have to start with '{part_head_list}'.")

    if len(search_text) < 7:
        raise exceptions.ParseError("Please, input more than 7 digits.")

    # TODO : (GERP MFG COST I/F) PART NUMBER 검색 INTERFACE 추가 후 수정
    try:
        db = null
    except:
        raise exceptions.ParseError("Can not connect Oracle DB.")

    # 조건에 맞는 data 갯수, page list 조회
    if search_text == '':
        return JsonResponse(data={}, safe=False)
    try:
        query = f""" SELECT COUNT(ROW_NUM)
                   FROM ( SELECT ROWNUM AS ROW_NUM , A.*
                          FROM (  SELECT COST_DIVISION_CODE, PERIOD_NAME, ITEM_NO, ITEM_DESCRIPTION, ENDING_PERIODIC_COST,
                                         ROW_NUMBER() OVER(PARTITION BY ITEM_NO ORDER BY TRANSFER_DATE DESC) AS RN 
                                  FROM XXGMFG_PAC_COST_IF
                                  WHERE ITEM_NO LIKE '{search_text}%'
                               ) A
                          WHERE A.RN = 1
                    )
                """
        cursor = db.cursor()
        cursor.execute(query)
        total_article = max(cursor.fetchone())
    except:
        total_article = 0
    if total_article == 0:
        data = { "data_list": [], "page_list": [1], "previous_page": 0,
                 "active_page": 1, "next_page": 0, "total_article": 0, }
        return JsonResponse(data, safe=False)

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

    sql = f""" SELECT *
               FROM ( SELECT ROWNUM AS ROW_NUM , A.*
                      FROM (  SELECT COST_DIVISION_CODE, PERIOD_NAME, ITEM_NO, ITEM_DESCRIPTION, ENDING_PERIODIC_COST,
                                     ROW_NUMBER() OVER(PARTITION BY ITEM_NO ORDER BY TRANSFER_DATE DESC) AS RN 
                              FROM XXGMFG_PAC_COST_IF
                              WHERE ITEM_NO LIKE '{search_text}%'
                           ) A
                      WHERE A.RN = 1
                    )
               WHERE ROW_NUM >= '{start_num}' AND ROW_NUM < '{start_num + page_num}'
               """
    cursor = db.cursor()
    cursor.execute(sql)
    cursor.rowfactory = make_dict(cursor)
    alldata = cursor.fetchall()

    item_list = []
    for rowdata in alldata:
        temp_data = {}
        temp_data['div_code'] = rowdata['COST_DIVISION_CODE']
        temp_data['period_name'] = rowdata['PERIOD_NAME']
        temp_data['part_number'] = rowdata['ITEM_NO']
        temp_data['description'] = rowdata['ITEM_DESCRIPTION']
        temp_data['part_cost'] = math.ceil(rowdata['ENDING_PERIODIC_COST'])

        part_number = rowdata['ITEM_NO']
        div_code = rowdata['COST_DIVISION_CODE']
        sql = f""" SELECT ITEM_CODE, ITEM_SPEC FROM TABLE(WS_GET_ITEM('{part_number}','','{div_code}','') )"""
        cursor = db.cursor()
        cursor.execute(sql)
        cursor.rowfactory = make_dict(cursor)
        spec_data = cursor.fetchone()
        temp_data['sepecification'] = spec_data["ITEM_SPEC"]

        item_list.append(temp_data)

    cursor.close()
    db.close()

    data = {
        "searchList": item_list,
        "page_list": page_list,
        "previous_page": previous_page,
        "active_page": active_page,
        "next_page": next_page,
        "total_article": total_article,
    }
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def modelSearch(request, site):

    return JsonResponse(data={}, safe=False)


@api_view(['GET'])
def assetSearch(request, site):
    data = {"searchList": [], "page_num": 10}
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def pcbPartNumberSearch(request, site):
    pcb_part = request.GET.get('search_text', '')
    return JsonResponse(data={}, safe=False)


def covert_option_type(option):
    # option 종류 판별 ##
    if '=' in option["column_data"] and ',' not in option["column_data"]:
        option["data_type"] = "fix"
        if "column_data_value" in option and option["column_data_value"] is not None:
            option["column_data_value"] = option["column_data_value"]
        else:
            option["column_data_value"] = option["column_data"]
            option["column_data_value"] = option["column_data_value"].replace("=", "")
    elif '=' in option["column_data"] or ':' in option["column_data"] or ',' in option["column_data"]:
        option["column_data"] = option["column_data"].strip("{'")
        option["column_data"] = option["column_data"].strip('}"')
        cdata_list = option["column_data"].split(',')
        if '=' in option["column_data"] or ':' in option["column_data"]:
            option["data_type"] = "component"
        else:
            option["data_type"] = "list"

        dict = {}
        for cdata in cdata_list:
            if '=' in cdata or ':' in cdata:
                if '=' in cdata:
                    key, value = cdata.split('=')
                else:
                    key, value = cdata.split(':')
                key = key.strip(" '")
                value = value.strip(" '")
                dict[key] = value
            else:
                cdata = cdata.strip()
                dict[cdata] = cdata
        option["column_data"] = dict
    elif option["column_data"] != '' and "column_data_value" not in option:
        option["column_data_value"] = option["column_data"]
    # option 종류 판별 ##

    # return option
    # 입력된 option 항목을 update 하여 return 함 (ref 참조)


# PCB Sample Option Calculator 에 정의되어 있는 값으로 mapping 하는 함수
def conversionData(psc_data, key, value):
    dict_data = {
        "column_data_value": "",
        "column_data_value2" : "",
        "column_data_key":""
    }
    for psc in psc_data:
        if "column_interface" in psc:
            if psc["column_interface"] == key:
                column_data = psc["column_data"]
                column_data = column_data.strip("[{'}] ")
                psc_select_list = column_data.split(',')
                for sel in psc_select_list:
                    if '=' in sel:
                        sel_key, sel_value = sel.split('=')
                    else:
                        sel_key = sel
                        sel_value = sel
                    dict_data["column_data_value"] = sel_value.strip()
                    dict_data["column_data_value2"] = sel_key.strip()
                    dict_data["column_data_key"] = sel_key.strip()
                    if dict_data["column_data_value"] == "__MANUAL__":
                        dict_data["column_data_value2"] = value
                        dict_data["column_data_key"] = value
                    if dict_data["column_data_value"] == value or dict_data["column_data_key"] == value:
                        break
    return dict_data




@api_view(['GET'])
def gpsContractNumberSearch(request, site):

    return JsonResponse(data={}, safe=False)


@api_view(['GET'])
def companySearch(request, site):

    return JsonResponse(data={}, safe=False)


@api_view(['GET'])
def gpsItemCategorySearch(request, site):

    return JsonResponse(data={}, safe=False)


@api_view(['GET', 'PUT'])
def loadPopup(request, site):
    if request.method == "GET":
        popupid = request.GET.get('popupid', '')
        menuid = request.GET.get('menuid', '')
        urlpath = request.GET.get('urlpath', '')

        div_list = request.preset["user_custom_div"].split(',')
        popupid_list = []
        if popupid != '':
            popup_obj = BoardPopup.objects.using(site).filter(parent_id=popupid)
        elif menuid != '':
            popup_obj = BoardPopup.objects.using(site).filter(
                target_id=menuid, popup_sdate__lte=timezone.now(), popup_edate__gte=timezone.now())
            for obj in popup_obj:
                pid = obj.parent_id
                if pid in request.session.get(f'{site}closedPopupList', []):
                    popupid_list.append(pid)
        else:
            popup_obj = []

        data_list = []
        for obj in popup_obj:
            check_div_name = False
            obj_div_list = obj.div_name.split(',')
            for obj_div in obj_div_list:
                if obj_div in div_list or obj_div == 'ALL':
                    check_div_name = True
                    break
            if check_div_name:
                pid = obj.parent_id
                if pid not in popupid_list:
                    popupid_list.append(pid)
                    db_data = Board.objects.using(site).get(id=pid)
                    obj_data = get_detail(site, db_data.id)[0]
                    data_list.append(obj_data)
        return JsonResponse(data=data_list, safe=False)
    elif request.method == "PUT":
        check_id = request.data.get('check_id', '')
        closedPopupList = request.session.get(f'{site}closedPopupList', [])
        if check_id != '':
            closedPopupList.append(check_id)
        request.session[f'{site}closedPopupList'] = closedPopupList
        return JsonResponse(data={}, safe=False)


def popupFileDownload(request,site , fid):
    file = BoardAttached.objects.using(site).get(id=fid)
    file_path = "{}{}".format(file.location, file.file_name)
    fs = FileSystemStorage(file_path)
    response = FileResponse(fs.open(file_path, 'rb'), content_type="application/octet-stream")
    response['Content-Disposition'] = f"attachment; filename={file.display_name.replace('’', '', )}"
    return response
