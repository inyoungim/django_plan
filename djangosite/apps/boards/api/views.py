import os
import shutil
from datetime import timedelta

import pytz
from django.core.files.storage import FileSystemStorage
from django.db import connections
from django.db.models import F, Q
from django.forms import model_to_dict
from django.http import JsonResponse, FileResponse
from rest_framework import serializers, exceptions
from rest_framework.decorators import api_view

from ..models import *

import logging

from ...middleware.models import MailingItem
from ...navMenu.models import NavMenu

logger = logging.getLogger('api')


def makedirs(path):
   try:
        os.makedirs(path, exist_ok=True)
   except OSError:
       if not os.path.isdir(path):
           raise


# BoardMaster Class 의 Queryset 을 serializer 하기 위한 class 선언 : 필수
class BoardMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardMaster
        fields = '__all__'


# BoardPopup Class 의 Queryset 을 serializer 하기 위한 class 선언 : 필수
class BoardPopupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardPopup
        fields = '__all__'


# Board Class 의 Queryset 을 serializer 하기 위한 class 선언 : 필수
class BoardSerializer(serializers.ModelSerializer):
    # modify_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    modify_date = serializers.SerializerMethodField('get_site_data')

    class Meta:
        model = Board
        fields = ['id', 'group_id', 'div_name', 'title', 'owner_empno', 'owner_name','owner_name_en',
                  'modify_date', 'hit_count', 'attached_count','answer_count']

    def get_site_data(self, obj):
        site = self.context.get("site", '')
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            data = obj.modify_date + timedelta(hours=7)
        else:
            data = obj.modify_date + timedelta(hours=9)
        return data.strftime('%Y-%m-%d %H:%M:%S')


# BoardComments Class 의 Queryset 을 serializer 하기 위한 class 선언 : 필수
class BoardCommentsSerializer(serializers.ModelSerializer):
    # create_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    create_date = serializers.SerializerMethodField('get_site_data')

    class Meta:
        model = BoardComments
        fields = ['id', 'comments', 'owner_empno', 'owner_name','owner_name_en','create_date']

    def get_site_data(self, obj):
        site = self.context.get("site", '')
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            data = obj.create_date + timedelta(hours=7)
        else:
            data = obj.create_date + timedelta(hours=9)
        return data.strftime('%Y-%m-%d %H:%M:%S')


def index(request,site ,bid):
    master = BoardMaster.objects.using(site).get(id=bid)
    div_name = request.GET.get('div_name''')
    active_page = int(request.GET.get('active_page', 1))  # request.GET['active_page']
    page_num = int(request.GET.get('page_num', 10))  # request.GET['page_num']
    search_text = request.GET.get('search_text', '')  # request.GET['search_text']

    if master.board_type == "QNA":
        db_data = Board.objects.using(site).filter(master_id=bid, id=F("group_id"))
    else:
        db_data = Board.objects.using(site).filter(master_id=bid)
    if search_text != '':
        db_data = db_data.filter(title__contains=search_text)
    # 조건에 맞는 data 갯수, page list 조회
    if div_name == 'ALL':
        div_list = request.preset["user_custom_div"].split(',')
        div_list.append('ALL')
        db_data = db_data.filter(div_name__in=div_list)
    else:
        db_data = db_data.filter(Q(div_name=div_name) | Q(div_name='ALL'))
    db_data = db_data.order_by('-group_modify_date')

    total_article = db_data.count()
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

    db_data = db_data[start_num: start_num + page_num]
    # queryset 결과를 list 형태로 serializer 하려면 many=True 옵션을 사용
    serializer = BoardSerializer(db_data, many=True, context={'site':site})
    # logger.debug(f'[ SQL ]{connection.queries[-1]["time"]} {db_data.query}')

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


def trim_max_len(str_msg, int_max_len=4000, encoding='euc-kr'):
    ''' 한글을 바이트 단위로 자를 수 있는 최대 길이를 계산하여 return '''
    try:
        result = str_msg.encode(encoding)[:int_max_len].decode(encoding)
        return int_max_len
    except UnicodeDecodeError:
        result = str_msg.encode(encoding)[:int_max_len - 1].decode(encoding)
        return int_max_len - 1


def get_popup_info(site, group_id):
    popup_data = BoardPopup.objects.using(site).filter(parent_id=group_id)
    p_data = {}
    if popup_data.count() > 0:
        p_data["id"] = popup_data[0].id
        p_data["div_name"] = popup_data[0].div_name
        p_data["popup_sdate"] = popup_data[0].popup_sdate
        p_data["popup_edate"] = popup_data[0].popup_edate
        menu = NavMenu.objects.using(site).get(pk=popup_data[0].target_id)
        p_data["target_id"] = menu.id
        p_data["target_menu"] = menu.name
    return p_data


def get_detail(site, pk):
    board = Board.objects.using(site).get(pk=pk)
    data_list = []
    if board.master.board_type == "QNA":
        group_data = Board.objects.using(site).filter(group_id=board.group_id)
    else:
        group_data = Board.objects.using(site).filter(id=board.id)
    for bd in group_data:
        result = BoardAttached.objects.using(site).values('id', 'display_name', 'file_size').filter(parent_id=bd.id)
        attached_files = [entry for entry in result]
        data = BoardSerializer(bd, context={'site':site}).data
        data["contents"] = bd.contents.decode()
        data["attached_files"] = attached_files
        data["popup"] = get_popup_info(site, bd.group_id)
        data["board_type"] = board.master.board_type
        data_list.append(data)
    return data_list


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def detail(request,site , bid, pk):
    master = BoardMaster.objects.using(site).get(id=bid)
    if request.method == "GET":  # load (view, modify)
        db_data = Board.objects.using(site).get(master_id=bid, id=pk)
        try:
            db_data = Board.objects.using(site).get(master_id=bid, id=pk)
            db_data.hit_count += 1
            db_data.save(using=site)
            data_list = get_detail(site, pk)
            request.preset['acc_history'] = {
                'acc_type1': 'READ',
                'acc_type2': 'Board',
                'acc_type3': master.name,
                'acc_type4': db_data.title
            }
        except:
            raise exceptions.ParseError("Can not find this article.<br>Try again after refresh.")
        return JsonResponse(data=data_list, safe=False)

    elif request.method == "POST":  # save new , pk = 0
        item_date = timezone.now()  # datetime.now()
        div_name = request.data.get('div_name', '')
        title = request.data.get('title', '')
        group_id = int(request.data.get('group_id', 0))
        contents = request.data.get('contents', '')
        files = request.POST.getlist('files')
        file_names = request.POST.getlist('file_names')

        db_data = Board()
        db_data.master_id = bid
        db_data.group_id = group_id
        db_data.div_name = div_name
        db_data.title = title
        db_data.contents = contents.encode()
        db_data.owner_name = request.preset['user_name']
        db_data.owner_name_en = request.preset['user_name_en']
        db_data.owner_empno = request.preset['user_emp_no']
        db_data.owner_mail = request.preset['user_mail']
        db_data.modify_date = item_date
        db_data.group_modify_date = item_date
        db_data.attached_count += len(list(files))
        db_data.save(using=site)
        if group_id == 0:
            db_data.group_id = db_data.id
            db_data.save(using=site)
        if div_name == 'ALL' and db_data.master.board_type == 'QNA':
            db_data.div_name = request.preset["user_custom_div"].split(',')[0]
            db_data.save(using=site)

        # QNA Board 일때 Question modify_date 가 수정되면 하위 Answer group_modify_date 도 수정
        # Answer 이 신규 생성되면 group_modify_date 를 Question 의 group_modify_date 로 변경
        if group_id > 0:
            parent_data = Board.objects.using(site).get(id=group_id)
            parent_data.answer_count += 1
            parent_data.save(using=site)

            group_data = Board.objects.using(site).filter(~Q(id=db_data.id), group_id=group_id)
            if group_data.count() > 0:
                group_data.update(group_modify_date=db_data.group_modify_date)

        # file move and input data to db
        try:
            nextid = BoardAttached.objects.using(site).latest('id').id + 1
        except:
            nextid = 1

        src = '/WEB_ROOT/DATA/temp/'
        des = f'/WEB_ROOT/DATA/{site}/board/'
        bulk_contents = []
        for i, file_name in enumerate(files):
            id_list = list(map(str, str(nextid)))
            id_path = "/".join(id_list) + "/"
            extension = os.path.splitext(str(file_name))[1]
            filename = f'{nextid}{extension}'
            file_size = os.path.getsize(src + file_name)
            makedirs(f'{des}{id_path}')
            shutil.move(src + file_name, f'{des}{id_path}{filename}')

            new_contents = BoardAttached()
            new_contents.parent_id = db_data.id
            new_contents.file_name = filename
            new_contents.location = des + id_path
            new_contents.display_name = file_names[i]
            new_contents.file_size = file_size
            bulk_contents.append(new_contents)
            nextid += 1
        BoardAttached.objects.using(site).bulk_create(bulk_contents)

        # QNA 게시판일 경우 메일링 리스트에 메일 송부
        if db_data.master.board_type == 'QNA':
            if db_data.group_id == db_data.id : ## Q
                item_title = f"[New Question] : {db_data.title}"
                from_user = f'{request.preset["user_name"]}<{request.preset["user_mail"]}>'
                mail_to_list = []
                to_list = db_data.master.board_mailing.split(',')
                for user_div in to_list:
                    user_info = user_div.split('=')
                    if len(user_info) == 1:
                        mail_to_list.append(user_info[0])
                    elif len(user_info) == 2:
                        if user_info[0] == db_data.div_name or user_info[0] == 'ALL':
                            mail_to_list.append(user_info[1])
                mail = MailingItem(
                    item_command="mailBoardContents",
                    item_id=db_data.id,
                    item_title=item_title,
                    item_comments=item_title,
                    from_user=from_user,
                    to_user_list=mail_to_list
                )
                mail.save(using=site)
            else: ## A
                item_title = f"[New Answer] : {db_data.title}"
                from_user = f'{request.preset["user_name"]}<{request.preset["user_mail"]}>'
                mail_to_list = []
                to_list = db_data.master.board_mailing.split(',')
                for user_div in to_list:
                    user_info = user_div.split('=')
                    if len(user_info) == 1:
                        mail_to_list.append(user_info[0])
                    elif len(user_info) == 2:
                        if user_info[0] == db_data.div_name or user_info[0] == 'ALL':
                            mail_to_list.append(user_info[1])
                owner_user_info = f'{db_data.owner_name}<{db_data.owner_mail}>'
                mail_to_list.append(owner_user_info)
                mail = MailingItem(
                    item_command="mailBoardContents",
                    item_id=db_data.id,
                    item_title=item_title,
                    item_comments=item_title,
                    from_user=from_user,
                    to_user_list=mail_to_list
                )
                mail.save(using=site)

        request.preset['acc_history'] = {
            'acc_type1': 'CREATE',
            'acc_type2': 'Board',
            'acc_type3': master.name,
            'acc_type4': db_data.title
        }
        data_list = get_detail(site, db_data.id)
        return JsonResponse(data=data_list, safe=False)

    elif request.method == "PUT":  # update, pk != 0
        """ PUT method 에서 request.data.get('title','')  로 data 를 가져오기 위해서는
            반드시 @api_view decorate 를 사용할 것 """
        item_date = timezone.now()  # datetime.now()
        div_name = request.data.get('div_name', '')
        title = request.data.get('title', '')
        group_id = int(request.data.get('group_id', 0))
        contents = request.data.get('contents', '')
        files = request.POST.getlist('files')
        file_names = request.POST.getlist('file_names')

        db_data = Board.objects.using(site).get(id=pk)
        db_data.group_id = group_id
        db_data.div_name = div_name
        db_data.title = title
        db_data.contents = contents.encode()
        db_data.owner_name = request.preset['user_name']
        db_data.owner_name_en = request.preset['user_name_en']
        db_data.owner_empno = request.preset['user_emp_no']
        db_data.owner_mail = request.preset['user_mail']
        db_data.modify_date = item_date
        if db_data.id == db_data.group_id:
            db_data.group_modify_date = item_date
        db_data.attached_count += len(list(files))
        db_data.save(using=site)

        # QNA Board 일때 Question modify_date 가 수정되면 하위 Answer group_modify_date 도 수정
        # Answer 이 신규 생성되면 group_modify_date 를 Question 의 group_modify_date 로 변경
        if db_data.id == db_data.group_id:
            group_data = Board.objects.using(site).filter(~Q(id=db_data.id),group_id=db_data.group_id)
            if group_data.count() > 0 :
                group_data.update(group_modify_date=db_data.group_modify_date)
        elif request.method == "PUT":
            question_data = Board.objects.using(site).get(id=db_data.group_id)
            question_data.answer_count += 1
            question_data.save(using=site)

            db_data.group_modify_date=question_data.group_modify_date
            db_data.save(using=site)

        # file move and input data to db
        try:
            nextid = BoardAttached.objects.using(site).latest('id').id + 1
        except:
            nextid = 1

        src = '/WEB_ROOT/DATA/temp/'
        des = f'/WEB_ROOT/DATA/{site}/board/'
        bulk_contents = []
        for i,file_name in enumerate(files):
            id_list = list(map(str, str(nextid)))
            id_path = "/".join(id_list) + "/"
            extension = os.path.splitext(str(file_name))[1]
            filename = f'{nextid}{extension}'
            file_size = os.path.getsize(src + file_name)
            makedirs(f'{des}{id_path}')
            shutil.move(src + file_name, f'{des}{id_path}{filename}')

            new_contents = BoardAttached()
            new_contents.parent_id = pk
            new_contents.file_name = filename
            new_contents.location = des + id_path
            new_contents.display_name = file_names[i]
            new_contents.file_size = file_size
            bulk_contents.append(new_contents)
            nextid += 1
        BoardAttached.objects.using(site).bulk_create(bulk_contents)

        request.preset['acc_history'] = {
            'acc_type1': 'UPDATE',
            'acc_type2': 'Board',
            'acc_type3': master.name,
            'acc_type4': db_data.title
        }
        data_list = get_detail(site, db_data.id)
        return JsonResponse(data=data_list, safe=False)

    elif request.method == "DELETE":  # delete
        db_data = Board.objects.using(site).get(master_id=bid, id=pk)
        # id 와 group_id 가 같고 answer_count > 0 일때 삭제 금지
        if db_data.id == db_data.group_id and db_data.answer_count > 0:
            raise exceptions.ParseError("Try after delete all Reply or Answer data.")
        # id 와 group_id 가 다르면 최상위 글 answer count 1 감소
        if db_data.id != db_data.group_id:
            pid_data = Board.objects.using(site).get(id=db_data.group_id)
            pid_data.answer_count -= 1
            pid_data.save(using=site)

        # remove attached file
        remove_item = BoardAttached.objects.using(site).filter(parent_id=pk)
        for file in remove_item:
            file_path = "{}{}".format(file.location, file.file_name)
            if os.path.isfile(file_path):
                os.remove(file_path)

        request.preset['acc_history'] = {
            'acc_type1': 'DELETE',
            'acc_type2': 'Board',
            'acc_type3': master.name,
            'acc_type4': db_data.title
        }
        db_data.delete()
        data = {}
        return JsonResponse(data, safe=False)


def get_comments_data(site, pk):
    db_data = BoardComments.objects.using(site).filter(parent_id=pk).order_by('create_date')
    # queryset 결과를 list 형태로 serializer 하려면 many=True 옵션을 사용
    serializer = BoardCommentsSerializer(db_data, many=True , context={'site':site})
    return serializer.data


@api_view(['GET', 'POST', 'DELETE'])
def comments(request,site , bid, pk):
    if request.method == "GET":  # load
        comments_list = get_comments_data(site, pk)
        data = {"comments_list": comments_list}
        return JsonResponse(data, safe=False)

    elif request.method == "POST":  # save new
        comments = request.POST.get('comments', '')
        new_item = BoardComments(
            parent_id = pk,
            comments = comments,
            owner_name = request.preset['user_name'],
            owner_name_en=request.preset['user_name_en'],
            owner_empno = request.preset['user_emp_no'],
            owner_mail = request.preset['user_mail'],
        )
        new_item.save(using=site)
        comments_list = get_comments_data(site, pk)
        data = {"comments_list": comments_list}
        return JsonResponse(data, safe=False)

    elif request.method == "DELETE":  # delete
        comments_id = int(request.data.get('comments_id', 0))
        remove_item = BoardComments.objects.using(site).get(id=comments_id)
        remove_item.delete()
        comments_list = get_comments_data(site, pk)
        data = {"comments_list": comments_list}
        return JsonResponse(data, safe=False)


@api_view(['DELETE', ])
def upload(request,site , bid, pk):
    if request.method == "DELETE":
        remove_files = request.data.get('remove_files', [])
        for fid in remove_files:
            remove_item = BoardAttached.objects.using(site).get(parent_id=pk, id=fid)
            file_path = "{}{}".format(remove_item.location, remove_item.file_name)
            if os.path.isfile(file_path):
                os.remove(file_path)
            remove_item.delete()

        if len(remove_files) > 0:
            db_data = Board.objects.using(site).get(id=pk)
            db_data.attached_count -= len(remove_files)
            db_data.save(using=site)

        return JsonResponse({}, safe=False)


def download(request,site , bid, fid):
    file = BoardAttached.objects.using(site).get(id=fid)
    file_path = "{}{}".format(file.location, file.file_name)
    fs = FileSystemStorage(file_path)
    response = FileResponse(fs.open(file_path, 'rb'), content_type="application/octet-stream")
    response['Content-Disposition'] = f"attachment; filename={file.display_name.replace('’', '', )}"
    return response


def moveAbleList(request,site, bid):
    active_page = int(request.GET.get('active_page', 1))  # request.GET['active_page']
    page_num = int(request.GET.get('page_num', 10))  # request.GET['page_num']
    search_text = request.GET.get('search_text', '')  # request.GET['search_text']

    boards = BoardMaster.objects.using(site).all()
    total_article = boards.count()
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

    serializer = BoardMasterSerializer(boards, many=True)
    data = {
        "data_list": serializer.data,
        "page_list": page_list,
        "previous_page": previous_page,
        "active_page": active_page,
        "next_page": next_page,
        "total_article": total_article,
        "current_bid" : bid,
    }
    return JsonResponse(data, safe=False)


@api_view(['PUT'])
def moveArticle(request,site, bid):
    to_bid = request.data.get('to_bid', None)
    group_id = request.data.get('group_id', None)

    group_data = Board.objects.using(site).filter(group_id=group_id)
    if group_data.count() > 0:
        group_data.update(master_id=to_bid)

    # QNA 게시판 중 Question 만 존재하는 글을 이동했을 경우 이동 게시판의 메일링 리스트에 메일 송부
    if group_data.count() == 1:
        base_board = Board.objects.using(site).get(id=group_id)
        if base_board.master.board_type == 'QNA':
            item_title = f"[New Question] : {base_board.title}"
            from_user = f'{base_board.owner_name}<{base_board.owner_mail}>'
            mail_to_list = []
            to_list = base_board.master.board_mailing.split(',')
            for user_div in to_list:
                user_info = user_div.split('=')
                if len(user_info) == 1:
                    mail_to_list.append(user_info[0])
                elif len(user_info) == 2:
                    if user_info[0] == base_board.div_name or user_info[0] == 'ALL':
                        mail_to_list.append(user_info[1])
            mail = MailingItem(
                item_command="mailBoardContents",
                item_id=base_board.id,
                item_title=item_title,
                item_comments=item_title,
                from_user=from_user,
                to_user_list=mail_to_list
            )
            mail.save(using=site)
    # # QNA 게시판 중 Question 만 존재하는 글을 이동했을 경우 이동 게시판의 메일링 리스트에 메일 송부

    return JsonResponse(data={}, safe=False)


def masterList(request,site):
    active_page = int(request.GET.get('active_page', 1))  # request.GET['active_page']
    page_num = int(request.GET.get('page_num', 10))  # request.GET['page_num']
    search_text = request.GET.get('search_text', '')  # request.GET['search_text']

    # 조건에 맞는 data 갯수, page list 조회
    search_condition = ""
    if search_text != '':
        search_condition = "AND name like '%{}%'".format(search_text)
    try:
        query = f"SELECT count(id) as count FROM boards_boardmaster WHERE id > -1 {search_condition}"
        cursor = connections[site].cursor()
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

    if search_text == '':
        db_data = BoardMaster.objects.using(site).all()[start_num: start_num + page_num]
    else:
        db_data = BoardMaster.objects.using(site).filter(name__contains=search_text)[start_num: start_num + page_num]
    # queryset 결과를 list 형태로 serializer 하려면 many=True 옵션을 사용
    serializer = BoardMasterSerializer(db_data, many=True)
    data = {
        "data_list": serializer.data,
        "page_list": page_list,
        "previous_page": previous_page,
        "active_page": active_page,
        "next_page": next_page,
        "total_article": total_article,
    }
    return JsonResponse(data, safe=False)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def masterDetail(request,site , pk):
    if request.method == "GET":  # load (view, modify)
        db_data = BoardMaster.objects.using(site).get(id=pk)
        request.preset['acc_history'] = {
            'acc_type1': 'READ',
            'acc_type2': 'Board',
            'acc_type3': 'Master',
            'acc_type4' : db_data.name
        }
        return JsonResponse(model_to_dict(db_data), safe=False)

    elif request.method == "POST":
        # axios 에서 FormData() 로 보낼경우 request.POST.get('item_name', '') 로 받고
        # axios 에서 dictionary 로 보낼경우 request.data.get('item_name', '') 로 받음
        name = request.data.get('name', '')
        new_item = BoardMaster(**request.data)
        if new_item.board_type != 'QNA':
            new_item.board_mailing = ""
        new_item.save(using=site)
        request.preset['acc_history'] = {
            'acc_type1': 'CREATE',
            'acc_type2': 'Board',
            'acc_type3': 'Master',
            'acc_type4': name
        }
        return JsonResponse(model_to_dict(new_item), safe=False)

    elif request.method == "PUT":
        db_data = BoardMaster(**request.data)
        if db_data.board_type != 'QNA':
            db_data.board_mailing = ""
        db_data.save(using=site)
        request.preset['acc_history'] = {
            'acc_type1': 'UPDATE',
            'acc_type2': 'Board',
            'acc_type3': 'Master',
            'acc_type4': db_data.name
        }
        return JsonResponse(model_to_dict(db_data), safe=False)

    elif request.method == "DELETE":  # delete
        db_data = BoardMaster.objects.using(site).get(id=pk)
        request.preset['acc_history'] = {
            'acc_type1': 'DELETE',
            'acc_type2': 'Board',
            'acc_type3': 'Master',
            'acc_type4': db_data.name
        }
        db_data.delete()
        data = {}
        return JsonResponse(data, safe=False)


def popupList(request,site ):
    active_page = int(request.GET.get('active_page', 1))  # request.GET['active_page']
    page_num = int(request.GET.get('page_num', 10))  # request.GET['page_num']

    db_all = BoardPopup.objects.using(site).all()
    total_article = db_all.count()

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

    db_data = db_all[start_num: start_num + page_num]
    data_list =[]
    for pd in db_data:
        sdata = BoardPopupSerializer(pd).data
        sdata["title"] = Board.objects.using(site).get(id=pd.parent_id).title
        menu = NavMenu.objects.using(site).get(pk=pd.target_id)
        sdata["menu_name"] = menu.name

        data_list.append(sdata)
    # queryset 결과를 list 형태로 serializer 하려면 many=True 옵션을 사용
    serializer = BoardPopupSerializer(db_data, many=True)
    data = {
        "data_list": data_list,
        "page_list": page_list,
        "previous_page": previous_page,
        "active_page": active_page,
        "next_page": next_page,
        "total_article": total_article,
    }


    return JsonResponse(data, safe=False)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def popupDetail(request,site , pk):
    if request.method == "GET":  # load (view, modify)
        db_data = BoardPopup.objects.using(site).get(id=pk)
        board = Board.objects.using(site).get(pk=db_data.parent_id)
        sdata = BoardPopupSerializer(db_data).data
        sdata["parent_id"] = sdata["parent"]
        sdata["title"] = board.title
        menu = NavMenu.objects.using(site).get(pk=db_data.target_id)
        sdata["target_menu"] = menu.name
        return JsonResponse(sdata, safe=False)

    elif request.method == "POST":
        parent_id = request.data.get('parent_id', '')
        div_name = request.data.get('div_name', '')
        popup_sdate = request.data.get('popup_sdate', None)
        popup_edate = request.data.get('popup_edate', None)
        target_id = request.data.get('target_id', 0)

        try:
            board = Board.objects.using(site).get(pk=parent_id)
        except:
            raise exceptions.ParseError("Invalid Board ID.")
        try:
            menu = NavMenu.objects.using(site).get(pk=target_id)
        except:
            raise exceptions.ParseError("Invalid Target ID.")

        new_item = BoardPopup()
        new_item.div_name = div_name
        new_item.popup_sdate = popup_sdate
        new_item.popup_edate = popup_edate
        new_item.target_id = target_id
        new_item.parent_id = parent_id
        new_item.save(using=site)

        sdata = BoardPopupSerializer(new_item).data
        sdata["parent_id"] = sdata["parent"]
        sdata["title"] = board.title
        sdata["target_menu"] = menu.name

        return JsonResponse(sdata, safe=False)

    elif request.method == "PUT":
        parent_id = request.data.get('parent_id', '')
        div_name = request.data.get('div_name', '')
        popup_sdate = request.data.get('popup_sdate', None)
        popup_edate = request.data.get('popup_edate', None)
        target_id = request.data.get('target_id', 0)

        try:
            board = Board.objects.using(site).get(pk=parent_id)
        except:
            raise exceptions.ParseError("Invalid Board ID.")
        try:
            menu = NavMenu.objects.using(site).get(pk=target_id)
        except:
            raise exceptions.ParseError("Invalid Target ID.")

        db_data = BoardPopup.objects.using(site).get(pk=pk)
        db_data.div_name = div_name
        db_data.popup_sdate = popup_sdate
        db_data.popup_edate = popup_edate
        db_data.target_id = target_id
        db_data.parent_id = parent_id
        db_data.save(using=site)

        sdata = BoardPopupSerializer(db_data).data
        sdata["parent_id"] = sdata["parent"]
        sdata["title"] = board.title
        sdata["target_menu"] = menu.name
        return JsonResponse(sdata, safe=False)

    elif request.method == "DELETE":  # delete
        db_data = BoardPopup.objects.using(site).get(id=pk)
        db_data.delete()
        data = {}
        return JsonResponse(data, safe=False)


@api_view(['PUT', 'DELETE'])
def updatePopup(request,site , bid, pk):
    if request.method == "PUT":
        id = request.data.get('id', 0)
        div_name = request.data.get('div_name', '')
        popup_sdate = request.data.get('popup_sdate', None)
        popup_edate = request.data.get('popup_edate', None)
        target_id = request.data.get('target_id', 0)

        try:
            menu = NavMenu.objects.using(site).get(pk=target_id)
        except:
            raise exceptions.ParseError("Invalid Target ID.")

        if id == 0:
            db_data = BoardPopup(
                div_name=div_name,
                popup_sdate=popup_sdate,
                popup_edate=popup_edate,
                target_id=target_id,
                parent_id=pk
            )
            db_data.save(using=site)
        else:
            db_data = BoardPopup.objects.using(site).get(pk=id)
            db_data.div_name = div_name
            db_data.popup_sdate = popup_sdate
            db_data.popup_edate = popup_edate
            db_data.target_id = target_id
            db_data.save(using=site)
        data = {}
        data["popup"] = get_popup_info(site, pk)
        return JsonResponse(data, safe=False)

    elif request.method == "DELETE":  # delete
        db_data = BoardPopup.objects.using(site).filter(parent_id=pk)
        db_data.delete()
        data = {}
        return JsonResponse(data, safe=False)