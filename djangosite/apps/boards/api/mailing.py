import subprocess

from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view

from ...middleware.models import MailingItem


@api_view(['POST'])
def sendmail(request, site, bid, doc_id):
    comments = request.data.get('comments')
    to_list = request.data.get('to_list')
    from_user = request.data.get('from', None)
    if not from_user:
        from_user = f'{request.preset["user_name"]}<{request.preset["user_mail"]}>'

    mail_to_list = []
    for user in to_list:
        mail_to_list.append(f"{user['name']}<{user['email']}>")

    mail = MailingItem(
        item_command="mailBoardContents",
        item_id=doc_id,
        item_comments=comments,
        from_user=from_user,
        to_user_list=mail_to_list
    )
    mail.save(using=site)

    if settings.DOMAIN == "rnd":
        django_command = "D:/WEB_ROOT/DjangoWeb/djangosite/prod_manage.py"
    else:
        django_command = "D:/WEB_ROOT/DjangoWeb/djangosite/manage.py"
    mail_command = subprocess.Popen([
        "python.exe", django_command, "mailBoardContents",
        f"{site}", f"{mail.id}"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    output, errors = mail_command.communicate()
    mail_command.wait()
    if output.decode('UTF-8') == '' and errors.decode('UTF-8') != '':
        data = {"msg": "System error occurred!"}
    else:
        data = {"msg": output.decode('UTF-8')}
    return JsonResponse(data=data, safe=False)
