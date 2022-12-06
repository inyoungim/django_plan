from datetime import datetime, date, timedelta

from django.db import connections
from django.http import JsonResponse
from django.db.models import Count
from django.utils import timezone
from rest_framework import serializers

from ...middleware.models import AccessHistory, AccessHistorySerializer
from ...navMenu.models import NavMenu


def date_range(start, end):
    start = datetime.strptime(start, "%Y-%m-%d")
    end = datetime.strptime(end, "%Y-%m-%d")
    dates = [(start + timedelta(days=i)).strftime("%Y-%m-%d") for i in range((end-start).days+1)]
    return dates


def descendants_menu_list(site,pk):
    allMenuIds = NavMenu.objects.using(site).get(pk=pk).get_descendants(include_self=True).using(site)
    menu_id_list = ""
    for menu in allMenuIds:
        if menu_id_list == "":
            menu_id_list = f"'{menu.id}'"
        else:
            menu_id_list = f"{menu_id_list},'{menu.id}'"
    return menu_id_list


def line_chart(request,site ,pk):
    start_date = request.GET.get('start_date', '')
    end_date = request.GET.get('end_date', '')
    menu_id_list = descendants_menu_list(site,pk)

    '''
    # date 형 비교시 timezone.make_aware 사용
    # --> group by 에 변경된 datetime 을 사용할 수 없음 ==> full loop 돌면서 +1 로 count
    sdate = timezone.make_aware(datetime.strptime(f"{start_date}", '%Y-%m-%d'))
    edate = timezone.make_aware(datetime.strptime(f"{end_date} 23:59:59", '%Y-%m-%d %H:%M:%S'))
    if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
        sdate -= timedelta(hours=2)
        edate -= timedelta(hours=2)

    statistics = AccessHistory.objects.using(site).filter(acc_date__gte=sdate, acc_date__lte=edate)
    data_list = AccessHistorySerializer(statistics, many=True, context={'site': site}).data
    dict = {}
    for d in data_list:
        key = f"{d['acc_date']}:{d['acc_type1']}"
        total = f"{d['acc_date']}"

        if key in dict:
            dict[key] += 1
        else:
            dict[key] = 1

        if total in dict:
            dict[total] += 1
        else:
            dict[total] = 1
    '''

    # date 형 비교시 timezone.make_aware 를 사용하지 않고 raw query 를 사용할 때
    with connections[site].cursor() as cursor:
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            plus_time = "+07:00"
        else:
            plus_time = "+09:00"
        cursor.execute(f"""
            SELECT DATE_FORMAT(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}'), '%Y-%m-%d'), ACC_TYPE1, COUNT(ID)
            FROM MIDDLEWARE_ACCESSHISTORY
            WHERE DATE(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}')) >= '{start_date}' 
                  AND DATE(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}')) <= '{end_date}'
                  AND MENU_ID IN ({menu_id_list})
            GROUP BY ACC_TYPE1, DATE_FORMAT(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}'), '%Y-%m-%d')
        """)
        dict = {}
        for d in cursor:
            key = f"{d[0]}:{d[1]}"
            total = f"{d[0]}"
            dict[key] = d[2]

            if total in dict:
                dict[total] += d[2]
            else:
                dict[total] = d[2]

    # sday,eday = calendar.monthrange(year, month) --> 월의 시작,마지막 요일 구하기
    labels = []
    data_days = []
    total_datas = []
    create_datas = []
    read_datas = []
    update_datas = []
    delete_datas = []
    for day in date_range(start_date, end_date):
        labels.append(day[8:10])
        data_days.append(day[:10])
        key1 = f"{day}:CREATE"
        key2 = f"{day}:READ"
        key3 = f"{day}:UPDATE"
        key4 = f"{day}:DELETE"

        if day in dict:
            total_datas.append(dict[day])
        else:
            total_datas.append(0)

        if key1 in dict:
            create_datas.append(dict[key1])
        else:
            create_datas.append(0)

        if key2 in dict:
            read_datas.append(dict[key2])
        else:
            read_datas.append(0)

        if key3 in dict:
            update_datas.append(dict[key3])
        else:
            update_datas.append(0)

        if key4 in dict:
            delete_datas.append(dict[key4])
        else:
            delete_datas.append(0)

    chartData = {
        'labels': labels,
        'data_days': data_days,
        'datasets': [{
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(75, 192, 192)',
                'label': 'Total',
                'fill':True,
                'tension':0.3,
                'borderWidth':2,
                'data': total_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(255, 150, 150)',
                'label': 'CREATE',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': create_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(150, 150, 255)',
                'label': 'READ',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': read_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(255, 150, 255)',
                'label': 'UPDATE',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': update_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(150, 150, 150)',
                'label': 'DELETE',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': delete_datas,
            },
        ]
    }

    data = {"chartData": chartData }
    return JsonResponse(data=data, safe=False)


def pie_chart(request,site ,pk):
    start_date = request.GET.get('start_date', '')
    end_date = request.GET.get('end_date', '')
    syear, smonth, sday = start_date.split('-')
    eyear, emonth, eday = end_date.split('-')

    menu_id_list = descendants_menu_list(site, pk)
    # date 형 비교시 timezone.make_aware 를 사용하지 않고 raw query 를 사용할 때
    with connections[site].cursor() as cursor:
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            plus_time = "+07:00"
        else:
            plus_time = "+09:00"
        cursor.execute(f"""
                SELECT DATE_FORMAT(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}'), '%Y-%m-%d'), ACC_TYPE1, COUNT(ID)
                FROM MIDDLEWARE_ACCESSHISTORY
                WHERE DATE(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}')) >= '{start_date}' 
                      AND DATE(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}')) <= '{end_date}'
                      AND MENU_ID IN ({menu_id_list})
                GROUP BY ACC_TYPE1, DATE_FORMAT(CONVERT_TZ(ACC_DATE,'+00:00','{plus_time}'), '%Y-%m-%d')
            """)
        dict = {}
        for d in cursor:
            key = f"{d[0]}:{d[1]}"
            total = f"{d[0]}"
            dict[key] = d[2]

            if total in dict:
                dict[total] += d[2]
            else:
                dict[total] = d[2]

    labels = []
    total_datas = []
    create_datas = []
    read_datas = []
    update_datas = []
    delete_datas = []
    for day in date_range(start_date, end_date):
        labels.append(day[8:10])
        key1 = f"{day}:CREATE"
        key2 = f"{day}:READ"
        key3 = f"{day}:UPDATE"
        key4 = f"{day}:DELETE"

        if day in dict:
            total_datas.append(dict[day])
        else:
            total_datas.append(0)

        if key1 in dict:
            create_datas.append(dict[key1])
        else:
            create_datas.append(0)

        if key2 in dict:
            read_datas.append(dict[key2])
        else:
            read_datas.append(0)

        if key3 in dict:
            update_datas.append(dict[key3])
        else:
            update_datas.append(0)

        if key4 in dict:
            delete_datas.append(dict[key4])
        else:
            delete_datas.append(0)

    chartData = {
        'labels': labels,
        'datasets': [{
            'backgroundColor': 'transparent',
            'borderColor': 'rgb(75, 192, 192)',
            'label': 'Total',
            'fill': True,
            'tension': 0.3,
            'borderWidth': 2,
            'data': total_datas,
        },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(255, 150, 150)',
                'label': 'CREATE',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': create_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(150, 150, 255)',
                'label': 'READ',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': read_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(255, 150, 255)',
                'label': 'UPDATE',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': update_datas,
            },
            {
                'backgroundColor': 'transparent',
                'borderColor': 'rgb(150, 150, 150)',
                'label': 'DELETE',
                'fill': True,
                'tension': 0.3,
                'borderWidth': 2,
                'data': delete_datas,
            },
        ]
    }
    data = {"chartData": chartData }
    return JsonResponse(data=data, safe=False)


def detailLists(request,site ,pk):
    target_date = request.GET.get('target_date', '')

    menu_id_list = descendants_menu_list(site, pk)
    # date 형 비교시 timezone.make_aware 를 사용하지 않고 raw query 를 사용할 때
    with connections[site].cursor() as cursor:
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            plus_time = "+07:00"
        else:
            plus_time = "+09:00"

    acc_history = AccessHistory.objects.using(site).all()
    start_date = timezone.make_aware(datetime.strptime(target_date, '%Y-%m-%d'))
    end_date = timezone.make_aware(datetime.strptime(target_date, '%Y-%m-%d')) + timedelta(hours=24)
    if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
        target_date -= timedelta(hours=2)
    acc_history = acc_history.filter(acc_date__gte=start_date, acc_date__lte=end_date).order_by('-acc_date')
    data = AccessHistorySerializer(acc_history, many=True, context={'site': site}).data
    return JsonResponse(data=data, safe=False)