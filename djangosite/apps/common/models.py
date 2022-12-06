from django.db import models
from django.utils import timezone
from rest_framework import serializers


class CommETaxInvoice(models.Model):
    invoice_num = models.CharField(max_length=16, blank=True, null=True)
    legacy_pk1 = models.CharField(max_length=8, blank=True, null=True)
    legacy_pk2 = models.CharField(max_length=8, blank=True, null=True)
    vat_gb = models.CharField(max_length=10, blank=True, null=True)
    vat_gb2 = models.CharField(max_length=150, blank=True, null=True)
    invoice_type = models.CharField(max_length=1, blank=True, null=True)
    invoice_type_gb = models.CharField(max_length=1, blank=True, null=True)
    comments = models.CharField(max_length=300, blank=True, null=True)
    attribute5 = models.CharField(max_length=250, blank=True, null=True)
    attribute6 = models.CharField(max_length=250, blank=True, null=True)
    attribute7 = models.CharField(max_length=250, blank=True, null=True)
    attribute8 = models.CharField(max_length=250, blank=True, null=True)
    buy_created_by = models.CharField(max_length=50, blank=True, null=True)
    buy_mail_receiver = models.CharField(max_length=150, blank=True, null=True)
    sup_created_by = models.CharField(max_length=50, blank=True, null=True)
    sup_mail_receiver = models.CharField(max_length=150, blank=True, null=True)
    invoice_status = models.CharField(max_length=20, blank=True, null=True)
    invoice_date = models.CharField(max_length=8, blank=True, null=True)
    sup_vat_registration_num = models.CharField(max_length=30, blank=True, null=True)
    sup_vendor_name = models.CharField(max_length=240, blank=True, null=True)
    sup_vendor_president = models.CharField(max_length=150, blank=True, null=True)
    sup_biz_type = models.CharField(max_length=200, blank=True, null=True)
    sup_biz_kind = models.CharField(max_length=200, blank=True, null=True)
    sup_address = models.CharField(max_length=1024, blank=True, null=True)
    buy_vat_registration_num = models.CharField(max_length=30, blank=True, null=True)
    buy_vendor_name = models.CharField(max_length=240, blank=True, null=True)
    buy_vendor_president = models.CharField(max_length=150, blank=True, null=True)
    buy_biz_type = models.CharField(max_length=200, blank=True, null=True)
    buy_biz_kind = models.CharField(max_length=200, blank=True, null=True)
    buy_address = models.CharField(max_length=1024, blank=True, null=True)
    total_amt = models.IntegerField(null=True)
    buy_amt = models.IntegerField(null=True)
    tax_amt = models.IntegerField(null=True)
    item_desc = models.CharField(max_length=240, blank=True, null=True)
    max_invoice_item_id = models.FloatField(null=True)
    dept_code = models.CharField(max_length=20, blank=True, null=True)
    supplier_code = models.CharField(max_length=30, blank=True, null=True)
    closingdate = models.CharField(max_length=8, blank=True, null=True)
    agnregnum = models.CharField(max_length=30, blank=True, null=True)
    agncmpname = models.CharField(max_length=240, blank=True, null=True)
    agnowner = models.CharField(max_length=240, blank=True, null=True)
    agnbiztype = models.CharField(max_length=200, blank=True, null=True)
    agnbizkind = models.CharField(max_length=200, blank=True, null=True)
    agnaddress = models.CharField(max_length=1024, blank=True, null=True)
    rcvmgmno1 = models.CharField(max_length=30, blank=True, null=True)
    rcvdtype1 = models.CharField(max_length=10, blank=True, null=True)
    rcvmstid2 = models.CharField(max_length=80, blank=True, null=True)
    rcvdtype2 = models.CharField(max_length=80, blank=True, null=True)
    rcvmgmno2 = models.CharField(max_length=30, blank=True, null=True)
    rcvusrname21 = models.CharField(max_length=80, blank=True, null=True)
    rcvemail21 = models.CharField(max_length=240, blank=True, null=True)
    rcvtel21 = models.CharField(max_length=30, blank=True, null=True)
    rcvusrname22 = models.CharField(max_length=80, blank=True, null=True)
    rcvemail22 = models.CharField(max_length=150, blank=True, null=True)
    rcvtel22 = models.CharField(max_length=30, blank=True, null=True)
    rcvusrname23 = models.CharField(max_length=80, blank=True, null=True)
    rcvemail23 = models.CharField(max_length=150, blank=True, null=True)
    rcvtel23 = models.CharField(max_length=30, blank=True, null=True)
    buy_mail_receiver_name2 = models.CharField(max_length=150, blank=True, null=True)
    buy_mail_receiver2 = models.CharField(max_length=150, blank=True, null=True)
    buy_mail_receiver_tel2 = models.CharField(max_length=20, blank=True, null=True)
    buy_mail_receiver_name3 = models.CharField(max_length=150, blank=True, null=True)
    buy_mail_receiver3 = models.CharField(max_length=150, blank=True, null=True)
    buy_mail_receiver_tel3 = models.CharField(max_length=20, blank=True, null=True)
    owncompregnum = models.CharField(max_length=30, blank=True, null=True)
    owncompname = models.CharField(max_length=240, blank=True, null=True)
    compregnum = models.CharField(max_length=30, blank=True, null=True)
    compname = models.CharField(max_length=240, blank=True, null=True)
    sup_mail_receiver_name = models.CharField(max_length=150, blank=True, null=True)
    sup_mail_receiver_tel = models.CharField(max_length=20, blank=True, null=True)
    source_system_name = models.CharField(max_length=30, blank=True, null=True)
    source_invoice_num = models.CharField(max_length=100, blank=True, null=True)
    source_system_num = models.CharField(max_length=16, blank=True, null=True)
    h_total_amt = models.IntegerField(null=True)
    l_total_amt = models.IntegerField(null=True)
    owner_name = models.CharField(max_length=20, blank=True, null=True)
    owner_id = models.CharField(max_length=20, blank=True, null=True)
    create_date = models.DateTimeField(default=timezone.now)


class CommETaxInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommETaxInvoice
        fields = '__all__'