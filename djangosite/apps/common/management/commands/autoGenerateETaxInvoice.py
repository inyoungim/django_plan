from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from django.forms import model_to_dict
from django.utils import timezone
from zeep import Client
from zeep.helpers import serialize_object

from ....budget.models import OrganizationMaster, ApprovalUserGroup, ApprovalUserGroupMaster
from ....common.models import CommETaxInvoice
from ....sysadmin.models import UserCustomDivision


def dict_fetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


class Command(BaseCommand):
    help = 'Automatic generate Electronic Tax Invoice'

    #def add_arguments(self, parser):
    #    parser.add_argument('site', default='hq', type=str)

    def handle(self, *args, **options):
        # site = options['site']

        site_list = ['hq', 'ic']
        today = timezone.localtime()
        one_weeks_ago = timezone.make_aware(
            datetime.strptime(f"{today.year}-{today.month}-{today.day}", '%Y-%m-%d')) - timedelta(days=7)

        api_url = 'http://165.243.166.90:7777/orabpel/GERP_FIN/getXetfInvoiceHLGERP/1.0/selXetfInvoiceHLGERPDBOutput?wsdl'
        client = Client(wsdl=api_url)

        old_data_all = CommETaxInvoice.objects.using('cm').all()
        old_data_all.delete()

        for site in site_list:
            div_list = []
            user_div_list = UserCustomDivision.objects.using(site).all()
            for user_div in user_div_list:
                div_names = user_div.div_name.split(',')
                div_list.extend(div_names)
            div_list = list(set(div_list))

            for div_name in div_list:
                div_org_list = OrganizationMaster.objects.using(site).filter(year=today.year, div_name=div_name)
                for org in div_org_list:
                    if not org.nas_code:
                        continue
                    request_data = {
                        'INVOICE_TYPE': '1',
                        'DEPT_CODE': f'{org.nas_code}',
                        'SUP_VAT_REGISTRATION_NUM': '',
                        'ORG_ID': '182',
                    }
                    # 165.243.166.90 lgesoacm --> wsdl 호출시 반드시 적용 할 것
                    data = client.service.process(**request_data)

                    monitoring_pics = ApprovalUserGroupMaster.objects.using(site).filter(
                        div_name=div_name, result_monitoring=True, group_type='Organization')
                    monitoring_pics = monitoring_pics.order_by('order_no')

                    if monitoring_pics.exists():
                        try:
                            pic_user = ApprovalUserGroup.objects.using(site).get(
                                div_name=div_name, year=today.year, parent_id=monitoring_pics[0].id,
                                assign_ids__contains=f"'{org.id}'")
                        except:
                            continue

                        key_name = {}
                        for i, column in enumerate(data.BPEL_COL_SPEC.split('|!F!|')):
                            key_name[i] = column

                        data_list = []
                        for output in data.selXetfInvoiceHLGERPDBOutput:
                            dict_data = {}
                            for i, value in enumerate(output.BPEL_DATA.split('|!F!|')):
                                dict_data[key_name[i]] = value
                            data_list.append(dict_data)

                        new_data_list = []
                        for data in data_list:
                            new_invoice = CommETaxInvoice()
                            new_invoice.invoice_num = data["INVOICE_NUM"]
                            new_invoice.legacy_pk1 = data["LEGACY_PK1"]
                            new_invoice.legacy_pk2 = data["LEGACY_PK2"]
                            new_invoice.vat_gb = data["VAT_GB"]
                            new_invoice.vat_gb2 = data["VAT_GB2"]
                            new_invoice.invoice_type = data["INVOICE_TYPE"]
                            new_invoice.invoice_type_gb = data["INVOICE_TYPE_GB"]
                            new_invoice.comments = data["COMMENTS"]
                            new_invoice.attribute5 = data["ATTRIBUTE5"]
                            new_invoice.attribute6 = data["ATTRIBUTE6"]
                            new_invoice.attribute7 = data["ATTRIBUTE7"]
                            new_invoice.attribute8 = data["ATTRIBUTE8"]
                            new_invoice.buy_created_by = data["BUY_CREATED_BY"]
                            new_invoice.buy_mail_receiver = data["BUY_MAIL_RECEIVER"]
                            new_invoice.sup_created_by = data["SUP_CREATED_BY"]
                            new_invoice.sup_mail_receiver = data["SUP_MAIL_RECEIVER"]
                            new_invoice.invoice_status = data["INVOICE_STATUS"]
                            new_invoice.invoice_date = data["INVOICE_DATE"]
                            new_invoice.sup_vat_registration_num = data["SUP_VAT_REGISTRATION_NUM"]
                            new_invoice.sup_vendor_name = data["SUP_VENDOR_NAME"]
                            new_invoice.sup_vendor_president = data["SUP_VENDOR_PRESIDENT"]
                            new_invoice.sup_biz_type = data["SUP_BIZ_TYPE"]
                            new_invoice.sup_biz_kind = data["SUP_BIZ_KIND"]
                            new_invoice.sup_address = data["SUP_ADDRESS"]
                            new_invoice.buy_vat_registration_num = data["BUY_VAT_REGISTRATION_NUM"]
                            new_invoice.buy_vendor_name = data["BUY_VENDOR_NAME"]
                            new_invoice.buy_vendor_president = data["BUY_VENDOR_PRESIDENT"]
                            new_invoice.buy_biz_type = data["BUY_BIZ_TYPE"]
                            new_invoice.buy_biz_kind = data["BUY_BIZ_KIND"]
                            new_invoice.buy_address = data["BUY_ADDRESS"]
                            new_invoice.total_amt = data["TOTAL_AMT"]
                            new_invoice.buy_amt = data["BUY_AMT"]
                            new_invoice.tax_amt = data["TAX_AMT"]
                            new_invoice.item_desc = data["ITEM_DESC"]
                            new_invoice.max_invoice_item_id = data["MAX_INVOICE_ITEM_ID"]
                            new_invoice.dept_code = data["DEPT_CODE"]
                            new_invoice.supplier_code = data["SUPPLIER_CODE"]
                            new_invoice.closingdate = data["CLOSINGDATE"]
                            new_invoice.agnregnum = data["AGNREGNUM"]
                            new_invoice.agncmpname = data["AGNCMPNAME"]
                            new_invoice.agnowner = data["AGNOWNER"]
                            new_invoice.agnbiztype = data["AGNBIZTYPE"]
                            new_invoice.agnbizkind = data["AGNBIZKIND"]
                            new_invoice.agnaddress = data["AGNADDRESS"]
                            new_invoice.rcvmgmno1 = data["RCVMGMNO1"]
                            new_invoice.rcvdtype1 = data["RCVDTYPE1"]
                            new_invoice.rcvmstid2 = data["RCVMSTID2"]
                            new_invoice.rcvdtype2 = data["RCVDTYPE2"]
                            new_invoice.rcvmgmno2 = data["RCVMGMNO2"]
                            new_invoice.rcvusrname21 = data["RCVUSRNAME21"]
                            new_invoice.rcvemail21 = data["RCVEMAIL21"]
                            new_invoice.rcvtel21 = data["RCVTEL21"]
                            new_invoice.rcvusrname22 = data["RCVUSRNAME22"]
                            new_invoice.rcvemail22 = data["RCVEMAIL22"]
                            new_invoice.rcvtel22 = data["RCVTEL22"]
                            new_invoice.rcvusrname23 = data["RCVUSRNAME23"]
                            new_invoice.rcvemail23 = data["RCVEMAIL23"]
                            new_invoice.rcvtel23 = data["RCVTEL23"]
                            new_invoice.buy_mail_receiver_name2 = data["BUY_MAIL_RECEIVER_NAME2"]
                            new_invoice.buy_mail_receiver2 = data["BUY_MAIL_RECEIVER2"]
                            new_invoice.buy_mail_receiver_tel2 = data["BUY_MAIL_RECEIVER_TEL2"]
                            new_invoice.buy_mail_receiver_name3 = data["BUY_MAIL_RECEIVER_NAME3"]
                            new_invoice.buy_mail_receiver3 = data["BUY_MAIL_RECEIVER3"]
                            new_invoice.buy_mail_receiver_tel3 = data["BUY_MAIL_RECEIVER_TEL3"]
                            new_invoice.owncompregnum = data["OWNCOMPREGNUM"]
                            new_invoice.owncompname = data["OWNCOMPNAME"]
                            new_invoice.compregnum = data["COMPREGNUM"]
                            new_invoice.compname = data["COMPNAME"]
                            new_invoice.sup_mail_receiver_name = data["SUP_MAIL_RECEIVER_NAME"]
                            new_invoice.sup_mail_receiver_tel = data["SUP_MAIL_RECEIVER_TEL"]
                            new_invoice.source_system_name = data["SOURCE_SYSTEM_NAME"]
                            new_invoice.source_invoice_num = data["SOURCE_INVOICE_NUM"]
                            new_invoice.source_system_num = data["SOURCE_SYSTEM_NUM"]
                            new_invoice.h_total_amt = data["H_TOTAL_AMT"]
                            new_invoice.l_total_amt = data["L_TOTAL_AMT"]
                            new_invoice.owner_name = pic_user.user_name
                            new_invoice.owner_id = pic_user.user_empno
                            new_data_list.append(new_invoice)

                        if len(new_data_list) > 0:
                            CommETaxInvoice.objects.using('cm').bulk_create(new_data_list, batch_size=500)
