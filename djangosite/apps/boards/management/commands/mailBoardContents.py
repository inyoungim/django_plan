import re

from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand

from ...models import *
from ....middleware.models import MailingItem
from ....workflow.api.views import get_approval_lines
from ...api.views import get_detail, get_comments_data
from django.conf import settings


def send_mail(item_list, site, mail):
    callout = mail.item_comments
    to_user_list = []
    mail_to_user_list = mail.to_user_list.strip("[")
    mail_to_user_list = mail_to_user_list.strip("]")
    for to in mail_to_user_list.split(","):
        to_user_list.append(to.replace('\'', ''))

    document_link = f"""<a class="btn btn-primary btn-sm" style="width:150px" target="_blank"
        href="http://{settings.DOMAIN}.lge.com/{site}/">Go to R&D System</a>
        """

    board_contents = ""
    for item in item_list:
        attached_file_list = ""
        for f in item["attached_files"]:
            attached_file_list = attached_file_list + f"""
                <div class="input-group">
                    <div class="px-2"></div>
                    <div class="px-0 py-1">{f["display_name"]} ({format(f["file_size"], ',')})</div>
                </div>
                """
        comments_list = get_comments_data(site, item["id"])
        comments_data = """<div class="col py-2">"""
        for cmt in comments_list:
            if site == "hq":
                cmt_owner_name = cmt["owner_name"]
            else:
                cmt_owner_name = cmt["owner_name_en"]
            comments_data = comments_data + f"""
                <div class="col hstack my-1" style="min-height:1.5rem;">
                    <div class="col ms-3"> {cmt["comments"]} </div>
                    <div class="hstack mx-3">
                        <span class="me-2">{cmt["create_date"]}</span>
                        <span>{cmt_owner_name}</span>
                    </div>
                </div>
                """
        comments_data = comments_data + "</div>"

        if item["board_type"] == "QNA" and item["id"] == item["group_id"]:
            board_contents = board_contents + """
                <div>
                    <i class="bi bi-question-square-fill text-primary fs-2"></i>
                    <span class="fs-2 ms-2">Question</span>
                </div>
                """
        if item["board_type"] == "QNA" and item["id"] != item["group_id"]:
            board_contents = board_contents + """
                <div>
                    <i class="bi bi-check-square-fill text-danger fs-2"></i>
                    <span class="fs-2 ms-2">Answer</span>
                </div>
                """

        if site == "hq":
            owner_name = item["owner_name"]
        else:
            owner_name = item["owner_name_en"]

        board_contents = board_contents + f"""
            <div class="row g-1">
                <div class="col">
                    <div class="col input-group">
                        <label class="input-group-text" style="width:100px;"><b>Title</b></label>
                        <label class="form-control bg-white">{item["title"]}</label>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="col input-group">
                        <span class="form-control bg-white text-secondary">
                            <span class="fs-6">{owner_name} | {item["modify_date"]}</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text" style="width:100px;"><b>Content</b></span>
                    <div class="form-control" style="min-height:200px;">
                        <note-contents>{item["contents"]}</note-contents>
                    </div>
                </div>
            </div>
            
            <div class="row mt-1">
                <div class="input-group">
                    <label class="input-group-text" style="width:100px;"><b>Attached</b></label>
                    <div class="col border">{attached_file_list}</div>
                </div>
            </div>
            
            <div class="row mt-1">
                <div class="input-group">
                    <label class="input-group-text" style="width:100px;"><b>Comments</b></label>
                    <div class="col border">{comments_data}</div>
                </div>
            </div>
            
        """

    custom_style_sheet = "<style> note-contents > p {line-height: 100%; margin:0.3em;} </style>"
    html_data = f"""
            <html type="text/html" lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>R&D System</title>
                <link href="http://{settings.DOMAIN}.lge.com/static/css/bootstrap.custom-v2.css" rel="stylesheet" />
                <link href="http://{settings.DOMAIN}.lge.com/static/css/styles_v2.css" rel="stylesheet" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
                {custom_style_sheet}
            </head>            
            <body>
                <div class="container px-0">
                
                    <div class="my-3">
                        <div class="hstack border-bottom border-primary my-1">
                            <div class="col-auto border border-bottom-0 border-secondary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                <i class="bi bi-grid-3x3-gap-fill px-2 text-danger"></i>
                                <b>Distribution Comment</b>
                            </div>
                            <div class="ms-auto"> {document_link} </div>
                        </div>
                        
                        <div class="col callout callout-primary">                    
                            <div class="vstack"> {callout} </div>
                        </div>
                    </div>
                    
                    <div>
                        {board_contents}
                    </div>
                    
                </div>
                
            </body>
            </html>
            """
    if mail.item_title and mail.item_title != '':
        subject = mail.item_title
    else:
        subject = f'[Distribution] {item["title"]}'
    from_email = mail.from_user
    to = to_user_list
    body = html_data
    msg = EmailMessage(subject=subject, body=body, from_email=from_email, to=to)
    msg.content_subtype = "html"

    for item in item_list:
        attached_files = BoardAttached.objects.using(site).filter(parent=item["id"])
        for file in attached_files:
            file_path = f'D:/{file.location}{file.file_name}'
            file_handle = open(file_path, "rb")
            msg.attach(file.display_name, file_handle.read(), 'application/octet-stream')
    msg.send()

    print("Success to distribute!")
    return


class Command(BaseCommand):
    help = 'Mailing Board data : specified site and mailingItems table id'

    def add_arguments(self, parser):
        parser.add_argument('site', default='hq', type=str)
        parser.add_argument('id', default=0, type=int)

    def handle(self, *args, **options):
        site = options['site']
        id = options['id']

        mail = MailingItem.objects.using(site).get(pk=id)
        data_list = get_detail(site, mail.item_id)
        send_mail(data_list, site, mail)
        mail.delete()
        # self.stderr.write('No Error')
        # self.stdout.write(self.style.SUCCESS('Successfully sending mail.'))
