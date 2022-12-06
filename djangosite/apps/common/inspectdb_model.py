# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from rest_framework import serializers


class IfTbCommScrap(models.Model):
    id = models.BigIntegerField(primary_key=True)
    txn_id = models.BigIntegerField(db_column='TXN_ID', blank=True, null=True)  # Field name made lowercase.
    crn_req_no = models.CharField(db_column='CRN_REQ_NO', max_length=12, blank=True, null=True)  # Field name made lowercase.
    emp_no = models.CharField(db_column='EMP_NO', max_length=20, blank=True, null=True)  # Field name made lowercase.
    subject = models.CharField(db_column='SUBJECT', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='STATUS', max_length=5, blank=True, null=True)  # Field name made lowercase.
    req_file_no = models.IntegerField(db_column='REQ_FILE_NO', blank=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CREATED_BY', max_length=20, blank=True, null=True)  # Field name made lowercase.
    created_dt = models.DateField(db_column='CREATED_DT', blank=True, null=True)  # Field name made lowercase.
    last_updated_by = models.CharField(db_column='LAST_UPDATED_BY', max_length=20, blank=True, null=True)  # Field name made lowercase.
    last_updated_dt = models.DateField(db_column='LAST_UPDATED_DT', blank=True, null=True)  # Field name made lowercase.
    confirmed_by = models.CharField(db_column='CONFIRMED_BY', max_length=20, blank=True, null=True)  # Field name made lowercase.
    confirmed_dt = models.DateField(db_column='CONFIRMED_DT', blank=True, null=True)  # Field name made lowercase.
    cmt = models.CharField(db_column='CMT', max_length=500, blank=True, null=True)  # Field name made lowercase.
    requested_by = models.CharField(db_column='REQUESTED_BY', max_length=20, blank=True, null=True)  # Field name made lowercase.
    requested_dt = models.DateField(db_column='REQUESTED_DT', blank=True, null=True)  # Field name made lowercase.
    transfer_flag = models.CharField(db_column='TRANSFER_FLAG', max_length=2, blank=True, null=True)  # Field name made lowercase.
    transfer_date = models.DateField(db_column='TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.
    attribute1 = models.CharField(db_column='ATTRIBUTE1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute2 = models.CharField(db_column='ATTRIBUTE2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute3 = models.CharField(db_column='ATTRIBUTE3', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute4 = models.CharField(db_column='ATTRIBUTE4', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute5 = models.CharField(db_column='ATTRIBUTE5', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute6 = models.CharField(db_column='ATTRIBUTE6', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute7 = models.CharField(db_column='ATTRIBUTE7', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute8 = models.CharField(db_column='ATTRIBUTE8', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute9 = models.CharField(db_column='ATTRIBUTE9', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute10 = models.CharField(db_column='ATTRIBUTE10', max_length=500, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'if_tb_comm_scrap'


class IfTbCommScrapList(models.Model):
    id = models.BigIntegerField(primary_key=True)
    txn_id = models.BigIntegerField(db_column='TXN_ID', blank=True, null=True)  # Field name made lowercase.
    crn_req_no = models.CharField(db_column='CRN_REQ_NO', max_length=12, blank=True, null=True)  # Field name made lowercase.
    sn = models.CharField(db_column='SN', max_length=50, blank=True, null=True)  # Field name made lowercase.
    model = models.CharField(db_column='MODEL', max_length=50, blank=True, null=True)  # Field name made lowercase.
    scan_status = models.CharField(db_column='SCAN_STATUS', max_length=2, blank=True, null=True)  # Field name made lowercase.
    f_scan_dt = models.DateField(db_column='F_SCAN_DT', blank=True, null=True)  # Field name made lowercase.
    f_emp_no = models.CharField(db_column='F_EMP_NO', max_length=20, blank=True, null=True)  # Field name made lowercase.
    sn_flag = models.CharField(db_column='SN_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    transfer_flag = models.CharField(db_column='TRANSFER_FLAG', max_length=2, blank=True, null=True)  # Field name made lowercase.
    transfer_date = models.DateField(db_column='TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.
    attribute1 = models.CharField(db_column='ATTRIBUTE1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute2 = models.CharField(db_column='ATTRIBUTE2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute3 = models.CharField(db_column='ATTRIBUTE3', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute4 = models.CharField(db_column='ATTRIBUTE4', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute5 = models.CharField(db_column='ATTRIBUTE5', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute6 = models.CharField(db_column='ATTRIBUTE6', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute7 = models.CharField(db_column='ATTRIBUTE7', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute8 = models.CharField(db_column='ATTRIBUTE8', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute9 = models.CharField(db_column='ATTRIBUTE9', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute10 = models.CharField(db_column='ATTRIBUTE10', max_length=500, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'if_tb_comm_scrap_list'


class IfTbCommScrapListSend(models.Model):
    id = models.BigIntegerField(primary_key=True)
    txn_id = models.BigIntegerField(db_column='TXN_ID', blank=True, null=True)  # Field name made lowercase.
    crn_req_no = models.CharField(db_column='CRN_REQ_NO', max_length=12, blank=True, null=True)  # Field name made lowercase.
    oil_req_no = models.CharField(db_column='OIL_REQ_NO', max_length=12, blank=True, null=True)  # Field name made lowercase.
    req_status = models.CharField(db_column='REQ_STATUS', max_length=10, blank=True, null=True)  # Field name made lowercase.
    company = models.CharField(db_column='COMPANY', max_length=100, blank=True, null=True)  # Field name made lowercase.
    confirmor_dept = models.CharField(db_column='CONFIRMOR_DEPT', max_length=200, blank=True, null=True)  # Field name made lowercase.
    confirmor = models.CharField(db_column='CONFIRMOR', max_length=200, blank=True, null=True)  # Field name made lowercase.
    confirmor_emp_no = models.CharField(db_column='CONFIRMOR_EMP_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    confirmed_date = models.DateField(db_column='CONFIRMED_DATE', blank=True, null=True)  # Field name made lowercase.
    transfer_flag = models.CharField(db_column='TRANSFER_FLAG', max_length=2, blank=True, null=True)  # Field name made lowercase.
    transfer_date = models.DateField(db_column='TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.
    attribute1 = models.CharField(db_column='ATTRIBUTE1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute2 = models.CharField(db_column='ATTRIBUTE2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute3 = models.CharField(db_column='ATTRIBUTE3', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute4 = models.CharField(db_column='ATTRIBUTE4', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute5 = models.CharField(db_column='ATTRIBUTE5', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute6 = models.CharField(db_column='ATTRIBUTE6', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute7 = models.CharField(db_column='ATTRIBUTE7', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute8 = models.CharField(db_column='ATTRIBUTE8', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute9 = models.CharField(db_column='ATTRIBUTE9', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute10 = models.CharField(db_column='ATTRIBUTE10', max_length=500, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'if_tb_comm_scrap_list_send'


class IfTbCommScrapSend(models.Model):
    id = models.BigIntegerField(primary_key=True)
    txn_id = models.BigIntegerField(db_column='TXN_ID', blank=True, null=True)  # Field name made lowercase.
    crn_req_no = models.CharField(db_column='CRN_REQ_NO', max_length=12, blank=True, null=True)  # Field name made lowercase.
    oil_req_no = models.CharField(db_column='OIL_REQ_NO', max_length=12, blank=True, null=True)  # Field name made lowercase.
    sn = models.CharField(db_column='SN', max_length=50, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='STATUS', max_length=10, blank=True, null=True)  # Field name made lowercase.
    company = models.CharField(db_column='COMPANY', max_length=100, blank=True, null=True)  # Field name made lowercase.
    scanner_dept = models.CharField(db_column='SCANNER_DEPT', max_length=200, blank=True, null=True)  # Field name made lowercase.
    scanner = models.CharField(db_column='SCANNER', max_length=200, blank=True, null=True)  # Field name made lowercase.
    scanner_emp_no = models.CharField(db_column='SCANNER_EMP_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    scanned_date = models.DateField(db_column='SCANNED_DATE', blank=True, null=True)  # Field name made lowercase.
    transfer_flag = models.CharField(db_column='TRANSFER_FLAG', max_length=2, blank=True, null=True)  # Field name made lowercase.
    transfer_date = models.DateField(db_column='TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.
    attribute1 = models.CharField(db_column='ATTRIBUTE1', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute2 = models.CharField(db_column='ATTRIBUTE2', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute3 = models.CharField(db_column='ATTRIBUTE3', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute4 = models.CharField(db_column='ATTRIBUTE4', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute5 = models.CharField(db_column='ATTRIBUTE5', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute6 = models.CharField(db_column='ATTRIBUTE6', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute7 = models.CharField(db_column='ATTRIBUTE7', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute8 = models.CharField(db_column='ATTRIBUTE8', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute9 = models.CharField(db_column='ATTRIBUTE9', max_length=500, blank=True, null=True)  # Field name made lowercase.
    attribute10 = models.CharField(db_column='ATTRIBUTE10', max_length=500, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'if_tb_comm_scrap_send'


class LgeimOrganization(models.Model):
    ORGAN = models.CharField(db_column='ORGAN', max_length=15, primary_key=True)  # Field name made lowercase.
    ORGAN_NAME = models.CharField(db_column='ORGAN_NAME', max_length=90, blank=True, null=True)  # Field name made lowercase.
    ORG_ENG_NAME = models.CharField(db_column='ORG_ENG_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    OLD_ORGAN = models.CharField(db_column='OLD_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    OLD_ORGAN_NAME = models.CharField(db_column='OLD_ORGAN_NAME', max_length=90, blank=True, null=True)  # Field name made lowercase.
    NAS_CODE = models.CharField(db_column='NAS_CODE', max_length=60, blank=True, null=True)  # Field name made lowercase.
    DATE_FROM = models.CharField(db_column='DATE_FROM', max_length=10, blank=True, null=True)  # Field name made lowercase.
    DATE_TO = models.CharField(db_column='DATE_TO', max_length=10, blank=True, null=True)  # Field name made lowercase.
    ORGAN_LEADER = models.CharField(db_column='ORGAN_LEADER', max_length=30, blank=True, null=True)  # Field name made lowercase.
    ORGAN_LEVEL = models.CharField(db_column='ORGAN_LEVEL', max_length=30, blank=True, null=True)  # Field name made lowercase.
    BUMUN_CODE = models.CharField(db_column='BUMUN_CODE', max_length=8, blank=True, null=True)  # Field name made lowercase.
    DIVISION = models.CharField(db_column='DIVISION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    BIZ_PLACE = models.CharField(db_column='BIZ_PLACE', max_length=150, blank=True, null=True)  # Field name made lowercase.
    BIZ_PLACE_NAME = models.CharField(db_column='BIZ_PLACE_NAME', max_length=60, blank=True, null=True)  # Field name made lowercase.
    LOCATION = models.CharField(db_column='LOCATION', max_length=75, blank=True, null=True)  # Field name made lowercase.
    LOCATION_NAME = models.CharField(db_column='LOCATION_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    HIGHER_ORGAN = models.CharField(db_column='HIGHER_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    HIGHER_LGENET_ORGAN = models.CharField(db_column='HIGHER_LGENET_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    ORG_UNIT = models.CharField(db_column='ORG_UNIT', max_length=4, blank=True, null=True)  # Field name made lowercase.
    DIV_NM = models.CharField(db_column='DIV_NM', max_length=50, blank=True, null=True)  # Field name made lowercase.
    CORPORATE = models.CharField(db_column='CORPORATE', max_length=200, blank=True, null=True)  # Field name made lowercase.
    ADDRESS = models.CharField(db_column='ADDRESS', max_length=750, blank=True, null=True)  # Field name made lowercase.
    TELEPHONE = models.CharField(db_column='TELEPHONE', max_length=60, blank=True, null=True)  # Field name made lowercase.
    FAX = models.CharField(db_column='FAX', max_length=60, blank=True, null=True)  # Field name made lowercase.
    INVESTMENT = models.CharField(db_column='INVESTMENT', max_length=150, blank=True, null=True)  # Field name made lowercase.
    LOCATION_CODE = models.CharField(db_column='LOCATION_CODE', max_length=60, blank=True, null=True)  # Field name made lowercase.
    DIV_NAME = models.CharField(db_column='DIV_NAME', max_length=60, blank=True, null=True)  # Field name made lowercase.
    ORGAN_D_LEADER = models.CharField(db_column='ORGAN_D_LEADER', max_length=30, blank=True, null=True)  # Field name made lowercase.
    OBU = models.CharField(db_column='OBU', max_length=15, blank=True, null=True)  # Field name made lowercase.
    OBU_NAME = models.CharField(db_column='OBU_NAME', max_length=60, blank=True, null=True)  # Field name made lowercase.
    LOCATION_ID = models.CharField(db_column='LOCATION_ID', max_length=15, blank=True, null=True)  # Field name made lowercase.
    LOCATION_COUNTRY = models.CharField(db_column='LOCATION_COUNTRY', max_length=60, blank=True, null=True)  # Field name made lowercase.
    SYS_FLAG = models.CharField(db_column='SYS_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    SUBSIDIARY = models.CharField(db_column='SUBSIDIARY', max_length=80, blank=True, null=True)  # Field name made lowercase.
    EQUAL_ORG = models.CharField(db_column='EQUAL_ORG', max_length=30, blank=True, null=True)  # Field name made lowercase.
    CREATE_DATE = models.DateField(db_column='CREATE_DATE', blank=True, null=True)  # Field name made lowercase.
    LAST_UPDATE_DATE = models.CharField(db_column='LAST_UPDATE_DATE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    LAST_MODIFIED = models.DateField(db_column='LAST_MODIFIED', blank=True, null=True)  # Field name made lowercase.
    ORGAN_GUBUN = models.CharField(db_column='ORGAN_GUBUN', max_length=1, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'lgeim_organization'


class LgeimOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LgeimOrganization
        fields = '__all__'


class LgeimUser(models.Model):
    SABUN = models.CharField(db_column='SABUN', max_length=30, primary_key=True)  # Field name made lowercase.
    SSOID = models.CharField(db_column='SSOID', max_length=32, blank=True, null=True)  # Field name made lowercase.
    NAME = models.CharField(db_column='NAME', max_length=75, blank=True, null=True)  # Field name made lowercase.
    NAME_ENG = models.CharField(db_column='NAME_ENG', max_length=300, blank=True, null=True)  # Field name made lowercase.
    FIRST_NAME = models.CharField(db_column='FIRST_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    LAST_NAME = models.CharField(db_column='LAST_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    EMAIL = models.CharField(db_column='EMAIL', max_length=240, blank=True, null=True)  # Field name made lowercase.
    NATIONALITY = models.CharField(db_column='NATIONALITY', max_length=30, blank=True, null=True)  # Field name made lowercase.
    SYS_FLAG = models.CharField(db_column='SYS_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    SUBSIDIARY = models.CharField(db_column='SUBSIDIARY', max_length=80, blank=True, null=True)  # Field name made lowercase.
    HTGUBUN = models.CharField(db_column='HTGUBUN', max_length=1, blank=True, null=True)  # Field name made lowercase.
    DIVISION = models.CharField(db_column='DIVISION', max_length=5, blank=True, null=True)  # Field name made lowercase.
    ORGAN = models.CharField(db_column='ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    SUPERVISOR_ID = models.CharField(db_column='SUPERVISOR_ID', max_length=30, blank=True, null=True)  # Field name made lowercase.
    JIKWI = models.CharField(db_column='JIKWI', max_length=60, blank=True, null=True)  # Field name made lowercase.
    JIKWI_NAME = models.CharField(db_column='JIKWI_NAME', max_length=80, blank=True, null=True)  # Field name made lowercase.
    JIKWI_NAME_ENG = models.CharField(db_column='JIKWI_NAME_ENG', max_length=50, blank=True, null=True)  # Field name made lowercase.
    JIKCHEK_NAME = models.CharField(db_column='JIKCHEK_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    JIKGAE_NAME = models.CharField(db_column='JIKGAE_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    JIKMU_NAME = models.CharField(db_column='JIKMU_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    JOB_ID = models.CharField(db_column='JOB_ID', max_length=15, blank=True, null=True)  # Field name made lowercase.
    JOB_NAME = models.CharField(db_column='JOB_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    GRADE_ID = models.CharField(db_column='GRADE_ID', max_length=15, blank=True, null=True)  # Field name made lowercase.
    GRADE_NAME = models.CharField(db_column='GRADE_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    POSITION_ID = models.CharField(db_column='POSITION_ID', max_length=15, blank=True, null=True)  # Field name made lowercase.
    POSITION_NAME = models.CharField(db_column='POSITION_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    WORK_TEL = models.CharField(db_column='WORK_TEL', max_length=60, blank=True, null=True)  # Field name made lowercase.
    MOBILE_TEL = models.CharField(db_column='MOBILE_TEL', max_length=60, blank=True, null=True)  # Field name made lowercase.
    LGENET_ID = models.CharField(db_column='LGENET_ID', max_length=32, blank=True, null=True)  # Field name made lowercase.
    EMP_GUBUN = models.CharField(db_column='EMP_GUBUN', max_length=1, blank=True, null=True)  # Field name made lowercase.
    EXTERNAL_MAIL = models.CharField(db_column='EXTERNAL_MAIL', max_length=240, blank=True, null=True)  # Field name made lowercase.
    AD_EMP_GUBUN = models.CharField(db_column='AD_EMP_GUBUN', max_length=1, blank=True, null=True)  # Field name made lowercase.
    NAME_HAN = models.CharField(db_column='NAME_HAN', max_length=150, blank=True, null=True)  # Field name made lowercase.
    HEALTH_INS_NO = models.CharField(db_column='HEALTH_INS_NO', max_length=150, blank=True, null=True)  # Field name made lowercase.
    HEALTH_INS_GUBUN = models.CharField(db_column='HEALTH_INS_GUBUN', max_length=150, blank=True, null=True)  # Field name made lowercase.
    SEX = models.CharField(db_column='SEX', max_length=30, blank=True, null=True)  # Field name made lowercase.
    BIRTH_DATE = models.CharField(db_column='BIRTH_DATE', max_length=13, blank=True, null=True)  # Field name made lowercase.
    PMGUBUN = models.CharField(db_column='PMGUBUN', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MARRIAGR_GUBUN = models.CharField(db_column='MARRIAGR_GUBUN', max_length=30, blank=True, null=True)  # Field name made lowercase.
    WEDDING_DATE = models.CharField(db_column='WEDDING_DATE', max_length=150, blank=True, null=True)  # Field name made lowercase.
    RH_ABO = models.CharField(db_column='RH_ABO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    BIRTH_REGION = models.CharField(db_column='BIRTH_REGION', max_length=180, blank=True, null=True)  # Field name made lowercase.
    EQUAL_SABUN = models.CharField(db_column='EQUAL_SABUN', max_length=30, blank=True, null=True)  # Field name made lowercase.
    PAY_PLACE = models.CharField(db_column='PAY_PLACE', max_length=15, blank=True, null=True)  # Field name made lowercase.
    PAY_PLACE_NAME = models.CharField(db_column='PAY_PLACE_NAME', max_length=60, blank=True, null=True)  # Field name made lowercase.
    NAS_DIVISION = models.CharField(db_column='NAS_DIVISION', max_length=5, blank=True, null=True)  # Field name made lowercase.
    PAY_DIVISION = models.CharField(db_column='PAY_DIVISION', max_length=5, blank=True, null=True)  # Field name made lowercase.
    ORGAN_NAME = models.CharField(db_column='ORGAN_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ORGAN_NAME_ENG = models.CharField(db_column='ORGAN_NAME_ENG', max_length=150, blank=True, null=True)  # Field name made lowercase.
    OLD_ORGAN = models.CharField(db_column='OLD_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    OLD_ORGAN_NAME = models.CharField(db_column='OLD_ORGAN_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GUTHO = models.CharField(db_column='GUTHO', max_length=240, blank=True, null=True)  # Field name made lowercase.
    CO_ENTER_DATE = models.CharField(db_column='CO_ENTER_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    HUN_COM_ENT_DATE = models.CharField(db_column='HUN_COM_ENT_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    T_DATE = models.CharField(db_column='T_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    H_DATE = models.CharField(db_column='H_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    B_DATE = models.CharField(db_column='B_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    JC_TYPE = models.CharField(db_column='JC_TYPE', max_length=2, blank=True, null=True)  # Field name made lowercase.
    SA_GI_GUBUN = models.CharField(db_column='SA_GI_GUBUN', max_length=1, blank=True, null=True)  # Field name made lowercase.
    FSE_YN = models.CharField(db_column='FSE_YN', max_length=60, blank=True, null=True)  # Field name made lowercase.
    UNION_YN = models.CharField(db_column='UNION_YN', max_length=60, blank=True, null=True)  # Field name made lowercase.
    UNION_UNIT = models.CharField(db_column='UNION_UNIT', max_length=60, blank=True, null=True)  # Field name made lowercase.
    JIKGUB_YEAR = models.CharField(db_column='JIKGUB_YEAR', max_length=150, blank=True, null=True)  # Field name made lowercase.
    PAY_NAS_DIVISION = models.CharField(db_column='PAY_NAS_DIVISION', max_length=5, blank=True, null=True)  # Field name made lowercase.
    PAY_ORGAN = models.CharField(db_column='PAY_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    COMPSALARY = models.CharField(db_column='COMPSALARY', max_length=10, blank=True, null=True)  # Field name made lowercase.
    BASESALARY = models.CharField(db_column='BASESALARY', max_length=10, blank=True, null=True)  # Field name made lowercase.
    JOB_TITLE_YEAR = models.CharField(db_column='JOB_TITLE_YEAR', max_length=10, blank=True, null=True)  # Field name made lowercase.
    EXT_ORGAN = models.CharField(db_column='EXT_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    EXT_ORGAN_NAME = models.CharField(db_column='EXT_ORGAN_NAME', max_length=90, blank=True, null=True)  # Field name made lowercase.
    OLD_EXT_ORGAN = models.CharField(db_column='OLD_EXT_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    OLD_EXT_ORGAN_NAME = models.CharField(db_column='OLD_EXT_ORGAN_NAME', max_length=90, blank=True, null=True)  # Field name made lowercase.
    EMP_CAT = models.CharField(db_column='EMP_CAT', max_length=10, blank=True, null=True)  # Field name made lowercase.
    PAY_GROUP = models.CharField(db_column='PAY_GROUP', max_length=20, blank=True, null=True)  # Field name made lowercase.
    DIVISION1_NM = models.CharField(db_column='DIVISION1_NM', max_length=100, blank=True, null=True)  # Field name made lowercase.
    DIVISION2_NM = models.CharField(db_column='DIVISION2_NM', max_length=100, blank=True, null=True)  # Field name made lowercase.
    JUNPYO_KYULJAE = models.CharField(db_column='JUNPYO_KYULJAE', max_length=8, blank=True, null=True)  # Field name made lowercase.
    LOCATION_ID = models.CharField(db_column='LOCATION_ID', max_length=15, blank=True, null=True)  # Field name made lowercase.
    LOCATION = models.CharField(db_column='LOCATION', max_length=75, blank=True, null=True)  # Field name made lowercase.
    BON_ADDRESS1 = models.CharField(db_column='BON_ADDRESS1', max_length=180, blank=True, null=True)  # Field name made lowercase.
    BON_ADDRESS2 = models.CharField(db_column='BON_ADDRESS2', max_length=90, blank=True, null=True)  # Field name made lowercase.
    BON_MAIL_NO = models.CharField(db_column='BON_MAIL_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    HUN_ADDRESS1 = models.CharField(db_column='HUN_ADDRESS1', max_length=180, blank=True, null=True)  # Field name made lowercase.
    HUN_ADDRESS2 = models.CharField(db_column='HUN_ADDRESS2', max_length=90, blank=True, null=True)  # Field name made lowercase.
    HUN_MAIL_NO = models.CharField(db_column='HUN_MAIL_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    HUN_TEL = models.CharField(db_column='HUN_TEL', max_length=60, blank=True, null=True)  # Field name made lowercase.
    DIRECT_TEL = models.CharField(db_column='DIRECT_TEL', max_length=60, blank=True, null=True)  # Field name made lowercase.
    FAX_TEL = models.CharField(db_column='FAX_TEL', max_length=60, blank=True, null=True)  # Field name made lowercase.
    C_START_DATE = models.CharField(db_column='C_START_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    C_END_DATE = models.CharField(db_column='C_END_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    ORIG_COM = models.CharField(db_column='ORIG_COM', max_length=150, blank=True, null=True)  # Field name made lowercase.
    L_SCHOLARSHIP = models.CharField(db_column='L_SCHOLARSHIP', max_length=150, blank=True, null=True)  # Field name made lowercase.
    L_SCHOOL_NAME = models.CharField(db_column='L_SCHOOL_NAME', max_length=160, blank=True, null=True)  # Field name made lowercase.
    MAJOR = models.CharField(db_column='MAJOR', max_length=150, blank=True, null=True)  # Field name made lowercase.
    RELIGION = models.CharField(db_column='RELIGION', max_length=150, blank=True, null=True)  # Field name made lowercase.
    HOBBY = models.CharField(db_column='HOBBY', max_length=150, blank=True, null=True)  # Field name made lowercase.
    TALENT = models.CharField(db_column='TALENT', max_length=150, blank=True, null=True)  # Field name made lowercase.
    CASE_HISTORY1 = models.CharField(db_column='CASE_HISTORY1', max_length=150, blank=True, null=True)  # Field name made lowercase.
    CASE_HISTORY2 = models.CharField(db_column='CASE_HISTORY2', max_length=150, blank=True, null=True)  # Field name made lowercase.
    CASE_HISTORY3 = models.CharField(db_column='CASE_HISTORY3', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MILITARY_YN = models.CharField(db_column='MILITARY_YN', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MILITARY_RANK = models.CharField(db_column='MILITARY_RANK', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MILITARY_NO = models.CharField(db_column='MILITARY_NO', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MILITARY_S_DATE = models.CharField(db_column='MILITARY_S_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    MILITARY_E_DATE = models.CharField(db_column='MILITARY_E_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    JUTGI = models.CharField(db_column='JUTGI', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ARM = models.CharField(db_column='ARM', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MILITARY_CLASS = models.CharField(db_column='MILITARY_CLASS', max_length=150, blank=True, null=True)  # Field name made lowercase.
    DISCHARGE_RESION = models.CharField(db_column='DISCHARGE_RESION', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MIL_EXCEPTION = models.CharField(db_column='MIL_EXCEPTION', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MILITARY_TYPE = models.CharField(db_column='MILITARY_TYPE', max_length=150, blank=True, null=True)  # Field name made lowercase.
    EXTRA_M_NO = models.CharField(db_column='EXTRA_M_NO', max_length=150, blank=True, null=True)  # Field name made lowercase.
    EXTRA_M_S_DATE = models.CharField(db_column='EXTRA_M_S_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    EXTRA_M_E_DATE = models.CharField(db_column='EXTRA_M_E_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    EXTRA_M_I_DATE = models.CharField(db_column='EXTRA_M_I_DATE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    BOHUN_TYPE = models.CharField(db_column='BOHUN_TYPE', max_length=150, blank=True, null=True)  # Field name made lowercase.
    BOHUN_NO = models.CharField(db_column='BOHUN_NO', max_length=150, blank=True, null=True)  # Field name made lowercase.
    SELFREG_RESOURCE = models.CharField(db_column='SELFREG_RESOURCE', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    CREATE_DATE = models.DateField(db_column='CREATE_DATE', blank=True, null=True)  # Field name made lowercase.
    LAST_UPDATE_DATE = models.CharField(db_column='LAST_UPDATE_DATE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    LAST_MODIFIED = models.DateField(db_column='LAST_MODIFIED', blank=True, null=True)  # Field name made lowercase.
    SSO_USE_PRV = models.CharField(db_column='SSO_USE_PRV', max_length=20, blank=True, null=True)  # Field name made lowercase.
    DA_FACT_CD = models.CharField(db_column='DA_FACT_CD', max_length=2, blank=True, null=True)  # Field name made lowercase.
    CREATOR_NO = models.CharField(db_column='CREATOR_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    CREATOR_ORGAN = models.CharField(db_column='CREATOR_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    SSO_END_DATE = models.CharField(db_column='SSO_END_DATE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    NAME_LAST = models.CharField(db_column='NAME_LAST', max_length=150, blank=True, null=True)  # Field name made lowercase.
    NAME_FIRST = models.CharField(db_column='NAME_FIRST', max_length=150, blank=True, null=True)  # Field name made lowercase.
    NAME_PREFERRED = models.CharField(db_column='NAME_PREFERRED', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE1 = models.CharField(db_column='ATTRIBUTE1', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE2 = models.CharField(db_column='ATTRIBUTE2', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE3 = models.CharField(db_column='ATTRIBUTE3', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE4 = models.CharField(db_column='ATTRIBUTE4', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE5 = models.CharField(db_column='ATTRIBUTE5', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE6 = models.CharField(db_column='ATTRIBUTE6', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE7 = models.CharField(db_column='ATTRIBUTE7', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE8 = models.CharField(db_column='ATTRIBUTE8', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE9 = models.CharField(db_column='ATTRIBUTE9', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE10 = models.CharField(db_column='ATTRIBUTE10', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE11 = models.CharField(db_column='ATTRIBUTE11', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE12 = models.CharField(db_column='ATTRIBUTE12', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE13 = models.CharField(db_column='ATTRIBUTE13', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE14 = models.CharField(db_column='ATTRIBUTE14', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE15 = models.CharField(db_column='ATTRIBUTE15', max_length=150, blank=True, null=True)  # Field name made lowercase.
    CREATED_BY = models.BigIntegerField(db_column='CREATED_BY', blank=True, null=True)  # Field name made lowercase.
    LAST_UPDATED_BY = models.BigIntegerField(db_column='LAST_UPDATED_BY', blank=True, null=True)  # Field name made lowercase.
    IM_SABUN_ID = models.BigIntegerField(db_column='IM_SABUN_ID', blank=True, null=True)  # Field name made lowercase.
    MANAGEMENT_ORGAN = models.CharField(db_column='MANAGEMENT_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    MANAGEMENT_ORGAN_NAME = models.CharField(db_column='MANAGEMENT_ORGAN_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    MANAGEMENT_ORGAN_NAME_ENG = models.CharField(db_column='MANAGEMENT_ORGAN_NAME_ENG', max_length=150, blank=True, null=True)  # Field name made lowercase.
    OLD_MANAGEMENT_ORGAN = models.CharField(db_column='OLD_MANAGEMENT_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    OLD_MANAGEMENT_ORGAN_NAME = models.CharField(db_column='OLD_MANAGEMENT_ORGAN_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    AFFILIATE_CODE = models.CharField(db_column='AFFILIATE_CODE', max_length=4, blank=True, null=True)  # Field name made lowercase.
    KMS_USE_FLAG = models.CharField(db_column='KMS_USE_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    EDMS_USE_FLAG = models.CharField(db_column='EDMS_USE_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    X_ORGAN_FLAG = models.CharField(db_column='X_ORGAN_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    EPMAIL_USE_PRV = models.CharField(db_column='EPMAIL_USE_PRV', max_length=1, blank=True, null=True)  # Field name made lowercase.
    X_ORGAN = models.CharField(db_column='X_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    X_ORGAN_NAME = models.CharField(db_column='X_ORGAN_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    X_ORGAN_NAME_ENG = models.CharField(db_column='X_ORGAN_NAME_ENG', max_length=150, blank=True, null=True)  # Field name made lowercase.
    OLD_X_ORGAN = models.CharField(db_column='OLD_X_ORGAN', max_length=15, blank=True, null=True)  # Field name made lowercase.
    OLD_X_ORGAN_NAME = models.CharField(db_column='OLD_X_ORGAN_NAME', max_length=150, blank=True, null=True)  # Field name made lowercase.
    WORK_AREA_CODE = models.CharField(db_column='WORK_AREA_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'lgeim_user'


class ViewIamUserInfo(models.Model):
    FULL_NAME = models.CharField(db_column='FULLNAME', max_length=75, blank=True, null=True)
    EMAIL = models.CharField(db_column='EMAIL', max_length=240, blank=True, null=True)
    ID = models.CharField(db_column='ID', max_length=32, blank=True, null=True)
    EMPLOYEE_NUMBER = models.CharField(db_column='EMPLOYEE_NUMBER', max_length=30, primary_key=True)
    JIKWI_NAME = models.CharField(db_column='JIKWI_NAME', max_length=80, blank=True, null=True)
    POSITION_NAME = models.CharField(db_column='POSITION_NAME', max_length=240, blank=True, null=True)
    WORK_TEL = models.CharField(db_column='WORK_TEL', max_length=60, blank=True, null=True)
    MOBILE_TEL = models.CharField(db_column='MOBILE_TEL', max_length=60, blank=True, null=True)
    ORG_NAME = models.CharField(db_column='ORG_NAME', max_length=150, blank=True, null=True)
    OLD_ORG_NAME = models.CharField(db_column='OLD_ORG_NAME', max_length=150, blank=True, null=True)
    TEAM_CODE = models.CharField(db_column='TEAM_CODE', max_length=60, blank=True, null=True)
    ORGANIZATION_ID = models.CharField(db_column='ORGANIZATION_ID', max_length=15, blank=True, null=True)
    PARENT_ORGANIZATION_ID = models.CharField(db_column='PARENT_ORGANIZATION_ID', max_length=15, blank=True, null=True)
    LAST_UPDATE_DATE = models.CharField(db_column='LAST_UPDATE_DATE', max_length=30, blank=True, null=True)
    PARENT_TEAM_CODE = models.CharField(db_column='PARENT_TEAM_CODE', max_length=60, blank=True, null=True)
    ORGANIZATION_LEVEL = models.CharField(db_column='ORGANIZATION_LEVEL', max_length=30, blank=True, null=True)
    RESIGNATION_FLAG = models.CharField(db_column='RESIGNATION_FLAG', max_length=1, blank=True, null=True)
    SUPERVISOR_NUMBER = models.CharField(db_column='SUPERVISOR_NUMBER', max_length=30, blank=True, null=True)
    DIVISION_CODE = models.CharField(db_column='DIVISION_CODE', max_length=5, blank=True, null=True)
    BIRTH_DATE = models.CharField(db_column='BIRTH_DATE', max_length=13, blank=True, null=True)
    AGE = models.CharField(db_column='AGE', max_length=5, blank=True, null=True)
    NAME_ENG = models.CharField(db_column='NAME_ENG', max_length=300, blank=True, null=True)
    JIKWI_NAME_ENG = models.CharField(db_column='JIKWI_NAME_ENG', max_length=50, blank=True, null=True)
    ORGAN_NAME_ENG = models.CharField(db_column='ORGAN_NAME_ENG', max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'view_iam_user_info'


class ViewIamUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewIamUserInfo
        fields = '__all__'


class LgepDelegation(models.Model):
    COMMAND_SEQ = models.IntegerField(db_column='COMMAND_SEQ', primary_key=True)
    COMMAND = models.CharField(db_column='COMMAND', max_length=3, blank=True, null=True)
    SYSTEM_ID = models.IntegerField(db_column='SYSTEM_ID')
    SYSTEM_PK = models.CharField(db_column='SYSTEM_PK', max_length=500, blank=True, null=True)
    C1 = models.CharField(db_column='C1', max_length=30, blank=True, null=True)
    DATE1 = models.DateField(db_column='DATE1', blank=True, null=True)
    DATE2 = models.DateField(db_column='DATE2', blank=True, null=True)
    SABUN1 = models.CharField(db_column='SABUN1', max_length=10, blank=True, null=True)
    SABUN2 = models.CharField(db_column='SABUN2', max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lgep_delegation'


class LgepDelegationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LgepDelegation
        fields = '__all__'


class XxgerpSalesOtsSoInfo(models.Model):
    DOCUMENT_DELIMITER_CODE = models.CharField(db_column='DOCUMENT_DELIMITER_CODE', primary_key=True, max_length=1)  # Field name made lowercase.
    ORDER_NO = models.CharField(db_column='ORDER_NO', max_length=30)  # Field name made lowercase.
    PURCHASE_ORDER_NO = models.CharField(db_column='PURCHASE_ORDER_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    ORDER_STATUS_CODE = models.CharField(db_column='ORDER_STATUS_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    CUSTOMER_CODE = models.CharField(db_column='CUSTOMER_CODE', max_length=14, blank=True, null=True)  # Field name made lowercase.
    CUSTOMER_NAME = models.CharField(db_column='CUSTOMER_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    SHIP_TO_CUSTOMER_CODE = models.CharField(db_column='SHIP_TO_CUSTOMER_CODE', max_length=14, blank=True, null=True)  # Field name made lowercase.
    SHIP_TO_CUSTOMER_NAME = models.CharField(db_column='SHIP_TO_CUSTOMER_NAME', max_length=50, blank=True, null=True)  # Field name made lowercase.
    COUNTRY_CODE = models.CharField(db_column='COUNTRY_CODE', max_length=3, blank=True, null=True)  # Field name made lowercase.
    COUNTRY_NAME = models.CharField(db_column='COUNTRY_NAME', max_length=100, blank=True, null=True)  # Field name made lowercase.
    REGION_CODE = models.CharField(db_column='REGION_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    REGION_NAME = models.CharField(db_column='REGION_NAME', max_length=200, blank=True, null=True)  # Field name made lowercase.
    WH_SHP_BRANCH_CODE = models.CharField(db_column='WH_SHP_BRANCH_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    BRANCH_NAME = models.CharField(db_column='BRANCH_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    TRANSACTION_NAME = models.CharField(db_column='TRANSACTION_NAME', max_length=30, blank=True, null=True)  # Field name made lowercase.
    SHIPMENT_FROM_SUPPLIER_CODE = models.CharField(db_column='SHIPMENT_FROM_SUPPLIER_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    SHIPMENT_FROM_SUPR_NAME = models.CharField(db_column='SHIPMENT_FROM_SUPR_NAME', max_length=75, blank=True, null=True)  # Field name made lowercase.
    FINAL_DESTINATION_CODE = models.CharField(db_column='FINAL_DESTINATION_CODE', max_length=5, blank=True, null=True)  # Field name made lowercase.
    FINAL_DESTINATION_NAME = models.CharField(db_column='FINAL_DESTINATION_NAME', max_length=75, blank=True, null=True)  # Field name made lowercase.
    PRICE_TERMS_CODE = models.CharField(db_column='PRICE_TERMS_CODE', max_length=15, blank=True, null=True)  # Field name made lowercase.
    PAYMENT_TERMS_CODE = models.CharField(db_column='PAYMENT_TERMS_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    ORDER_CREATION_DATE = models.DateField(db_column='ORDER_CREATION_DATE', blank=True, null=True)  # Field name made lowercase.
    PURCHASE_CREATION_DATE = models.DateField(db_column='PURCHASE_CREATION_DATE', blank=True, null=True)  # Field name made lowercase.
    PURCHASER_ID = models.BigIntegerField(db_column='PURCHASER_ID', blank=True, null=True)  # Field name made lowercase.
    ORDER_TYPE_CODE = models.CharField(db_column='ORDER_TYPE_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    SALES_DEPARTMENT_CODE = models.CharField(db_column='SALES_DEPARTMENT_CODE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    SALES_DEPARTMENT_NAME = models.CharField(db_column='SALES_DEPARTMENT_NAME', max_length=100, blank=True, null=True)  # Field name made lowercase.
    SALES_PERSON_NAME = models.CharField(db_column='SALES_PERSON_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    CURRENCY_CODE = models.CharField(db_column='CURRENCY_CODE', max_length=15, blank=True, null=True)  # Field name made lowercase.
    FOREIGN_CURRENCY_XRATE = models.BigIntegerField(db_column='FOREIGN_CURRENCY_XRATE', blank=True, null=True)  # Field name made lowercase.
    KRW_EXCHANGE_RATE = models.BigIntegerField(db_column='KRW_EXCHANGE_RATE', blank=True, null=True)  # Field name made lowercase.
    CONTRACT_NO = models.CharField(db_column='CONTRACT_NO', max_length=50, blank=True, null=True)  # Field name made lowercase.
    SHIPPING_METHOD_CODE = models.CharField(db_column='SHIPPING_METHOD_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    ORGANIZATION_CODE = models.CharField(db_column='ORGANIZATION_CODE', max_length=3, blank=True, null=True)  # Field name made lowercase.
    COMBINATION_LINE_NO = models.CharField(db_column='COMBINATION_LINE_NO', max_length=20, blank=True, null=True)  # Field name made lowercase.
    SPLIT_FROM_LINE_ID = models.BigIntegerField(db_column='SPLIT_FROM_LINE_ID', blank=True, null=True)  # Field name made lowercase.
    PURCHASE_ORDER_LINE_NO = models.CharField(db_column='PURCHASE_ORDER_LINE_NO', max_length=50, blank=True, null=True)  # Field name made lowercase.
    SALES_MODEL_CODE = models.CharField(db_column='SALES_MODEL_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    SALES_SUFFIX_CODE = models.CharField(db_column='SALES_SUFFIX_CODE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    MODEL_CODE = models.CharField(db_column='MODEL_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    SUFFIX_CODE = models.CharField(db_column='SUFFIX_CODE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    CUSTOMER_MODEL_CODE = models.CharField(db_column='CUSTOMER_MODEL_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    PRODUCT_LINE_CODE = models.CharField(db_column='PRODUCT_LINE_CODE', max_length=4, blank=True, null=True)  # Field name made lowercase.
    ORDER_QTY = models.BigIntegerField(db_column='ORDER_QTY', blank=True, null=True)  # Field name made lowercase.
    PURCHASE_QTY = models.BigIntegerField(db_column='PURCHASE_QTY', blank=True, null=True)  # Field name made lowercase.
    UNIT_SELLING_PRICE = models.BigIntegerField(db_column='UNIT_SELLING_PRICE', blank=True, null=True)  # Field name made lowercase.
    SCHEDULE_SHIP_DATE = models.DateField(db_column='SCHEDULE_SHIP_DATE', blank=True, null=True)  # Field name made lowercase.
    REQUEST_DATE = models.DateField(db_column='REQUEST_DATE', blank=True, null=True)  # Field name made lowercase.
    INVENTORY_ITEM_ID = models.BigIntegerField(db_column='INVENTORY_ITEM_ID', blank=True, null=True)  # Field name made lowercase.
    ORDER_QUANTITY_UOM = models.CharField(db_column='ORDER_QUANTITY_UOM', max_length=3, blank=True, null=True)  # Field name made lowercase.
    LC_NO = models.CharField(db_column='LC_NO', max_length=35, blank=True, null=True)  # Field name made lowercase.
    LC_OPEN_DATE = models.DateField(db_column='LC_OPEN_DATE', blank=True, null=True)  # Field name made lowercase.
    PAYMENT_TERMS2_CODE = models.CharField(db_column='PAYMENT_TERMS2_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    DELETE_STATUS_CODE = models.CharField(db_column='DELETE_STATUS_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    REFERENCE_HEADER_ID = models.BigIntegerField(db_column='REFERENCE_HEADER_ID', blank=True, null=True)  # Field name made lowercase.
    REFERENCE_LINE_ID = models.BigIntegerField(db_column='REFERENCE_LINE_ID', blank=True, null=True)  # Field name made lowercase.
    RETURN_REASON_CODE = models.CharField(db_column='RETURN_REASON_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    CANCEL_QTY = models.BigIntegerField(db_column='CANCEL_QTY', blank=True, null=True)  # Field name made lowercase.
    SHIPMENT_QTY = models.BigIntegerField(db_column='SHIPMENT_QTY', blank=True, null=True)  # Field name made lowercase.
    FULFILLMENT_QTY = models.BigIntegerField(db_column='FULFILLMENT_QTY', blank=True, null=True)  # Field name made lowercase.
    SHIPPING_QTY = models.BigIntegerField(db_column='SHIPPING_QTY', blank=True, null=True)  # Field name made lowercase.
    BOOKED_FLAG = models.CharField(db_column='BOOKED_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    BOOKED_DATE = models.DateField(db_column='BOOKED_DATE', blank=True, null=True)  # Field name made lowercase.
    CANCELLED_FLAG = models.CharField(db_column='CANCELLED_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    OPEN_FLAG = models.CharField(db_column='OPEN_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    ORDER_LINE_ID = models.BigIntegerField(db_column='ORDER_LINE_ID', blank=True, null=True)  # Field name made lowercase.
    INVOICE_NO = models.CharField(db_column='INVOICE_NO', max_length=50, blank=True, null=True)  # Field name made lowercase.
    REAL_CUSTOMER_PO_NO = models.CharField(db_column='REAL_CUSTOMER_PO_NO', max_length=50, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE1 = models.CharField(db_column='ATTRIBUTE1', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE2 = models.CharField(db_column='ATTRIBUTE2', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE3 = models.CharField(db_column='ATTRIBUTE3', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE4 = models.CharField(db_column='ATTRIBUTE4', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE5 = models.CharField(db_column='ATTRIBUTE5', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE6 = models.CharField(db_column='ATTRIBUTE6', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE7 = models.CharField(db_column='ATTRIBUTE7', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE8 = models.CharField(db_column='ATTRIBUTE8', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE9 = models.CharField(db_column='ATTRIBUTE9', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE10 = models.CharField(db_column='ATTRIBUTE10', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE11 = models.CharField(db_column='ATTRIBUTE11', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE12 = models.CharField(db_column='ATTRIBUTE12', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE13 = models.CharField(db_column='ATTRIBUTE13', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE14 = models.CharField(db_column='ATTRIBUTE14', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE15 = models.CharField(db_column='ATTRIBUTE15', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE16 = models.CharField(db_column='ATTRIBUTE16', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE17 = models.CharField(db_column='ATTRIBUTE17', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE18 = models.CharField(db_column='ATTRIBUTE18', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE19 = models.CharField(db_column='ATTRIBUTE19', max_length=150, blank=True, null=True)  # Field name made lowercase.
    ATTRIBUTE20 = models.CharField(db_column='ATTRIBUTE20', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE1 = models.CharField(db_column='GLOBAL_ATTRIBUTE1', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE2 = models.CharField(db_column='GLOBAL_ATTRIBUTE2', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE3 = models.CharField(db_column='GLOBAL_ATTRIBUTE3', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE4 = models.CharField(db_column='GLOBAL_ATTRIBUTE4', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE5 = models.CharField(db_column='GLOBAL_ATTRIBUTE5', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE6 = models.CharField(db_column='GLOBAL_ATTRIBUTE6', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE7 = models.CharField(db_column='GLOBAL_ATTRIBUTE7', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE8 = models.CharField(db_column='GLOBAL_ATTRIBUTE8', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE9 = models.CharField(db_column='GLOBAL_ATTRIBUTE9', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE10 = models.CharField(db_column='GLOBAL_ATTRIBUTE10', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE11 = models.CharField(db_column='GLOBAL_ATTRIBUTE11', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE12 = models.CharField(db_column='GLOBAL_ATTRIBUTE12', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE13 = models.CharField(db_column='GLOBAL_ATTRIBUTE13', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE14 = models.CharField(db_column='GLOBAL_ATTRIBUTE14', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE15 = models.CharField(db_column='GLOBAL_ATTRIBUTE15', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE16 = models.CharField(db_column='GLOBAL_ATTRIBUTE16', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE17 = models.CharField(db_column='GLOBAL_ATTRIBUTE17', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE18 = models.CharField(db_column='GLOBAL_ATTRIBUTE18', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE19 = models.CharField(db_column='GLOBAL_ATTRIBUTE19', max_length=150, blank=True, null=True)  # Field name made lowercase.
    GLOBAL_ATTRIBUTE20 = models.CharField(db_column='GLOBAL_ATTRIBUTE20', max_length=150, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE1 = models.CharField(db_column='RETURN_ATTRIBUTE1', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE2 = models.CharField(db_column='RETURN_ATTRIBUTE2', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE3 = models.CharField(db_column='RETURN_ATTRIBUTE3', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE4 = models.CharField(db_column='RETURN_ATTRIBUTE4', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE5 = models.CharField(db_column='RETURN_ATTRIBUTE5', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE6 = models.CharField(db_column='RETURN_ATTRIBUTE6', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE7 = models.CharField(db_column='RETURN_ATTRIBUTE7', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE8 = models.CharField(db_column='RETURN_ATTRIBUTE8', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE9 = models.CharField(db_column='RETURN_ATTRIBUTE9', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE10 = models.CharField(db_column='RETURN_ATTRIBUTE10', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE11 = models.CharField(db_column='RETURN_ATTRIBUTE11', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE12 = models.CharField(db_column='RETURN_ATTRIBUTE12', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE13 = models.CharField(db_column='RETURN_ATTRIBUTE13', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE14 = models.CharField(db_column='RETURN_ATTRIBUTE14', max_length=240, blank=True, null=True)  # Field name made lowercase.
    RETURN_ATTRIBUTE15 = models.CharField(db_column='RETURN_ATTRIBUTE15', max_length=240, blank=True, null=True)  # Field name made lowercase.
    EMPLOYEE_NO = models.CharField(db_column='EMPLOYEE_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    ORDER_SOURCE_ID = models.BigIntegerField(db_column='ORDER_SOURCE_ID', blank=True, null=True)  # Field name made lowercase.
    PRODUCT_TYPE_CODE = models.CharField(db_column='PRODUCT_TYPE_CODE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    PAYMENT_TERMS_INFO = models.CharField(db_column='PAYMENT_TERMS_INFO', max_length=4000, blank=True, null=True)  # Field name made lowercase.
    LINE_CATEGORY_CODE = models.CharField(db_column='LINE_CATEGORY_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    MAIL_ID = models.CharField(db_column='MAIL_ID', max_length=50, blank=True, null=True)  # Field name made lowercase.
    ACCOUNTING_UNIT_CODE = models.CharField(db_column='ACCOUNTING_UNIT_CODE', max_length=3, blank=True, null=True)  # Field name made lowercase.
    NET_FOB_PRICE = models.BigIntegerField(db_column='NET_FOB_PRICE', blank=True, null=True)  # Field name made lowercase.
    CANCEL_DATE = models.DateField(db_column='CANCEL_DATE', blank=True, null=True)  # Field name made lowercase.
    WH_SHP_REQUEST_FLAG = models.CharField(db_column='WH_SHP_REQUEST_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    PO_LINE_NO = models.CharField(db_column='PO_LINE_NO', max_length=50, blank=True, null=True)  # Field name made lowercase.
    ORDER_SOURCE_NAME = models.CharField(db_column='ORDER_SOURCE_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    TRANSFER_FLAG = models.CharField(db_column='TRANSFER_FLAG', max_length=1)  # Field name made lowercase.
    TRANSFER_DATE = models.DateField(db_column='TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.
    CREATION_DATE = models.DateField(db_column='CREATION_DATE', blank=True, null=True)  # Field name made lowercase.
    LAST_UPDATE_DATE = models.DateField(db_column='LAST_UPDATE_DATE', blank=True, null=True)  # Field name made lowercase.
    HEADER_ID = models.BigIntegerField(db_column='HEADER_ID', blank=True, null=True)  # Field name made lowercase.
    GLOBAL_UNIQUE_ID = models.CharField(db_column='GLOBAL_UNIQUE_ID', max_length=100, blank=True, null=True)  # Field name made lowercase.
    BAM_SEQUENCE_ID = models.BigIntegerField(db_column='BAM_SEQUENCE_ID', blank=True, null=True)  # Field name made lowercase.
    OLD_GLOBAL_UNIQUE_ID = models.CharField(db_column='OLD_GLOBAL_UNIQUE_ID', max_length=100, blank=True, null=True)  # Field name made lowercase.
    DATA_CREATION_TYPE_CODE = models.CharField(db_column='DATA_CREATION_TYPE_CODE', max_length=1, blank=True, null=True)  # Field name made lowercase.
    LAST_UPDATED_BY = models.BigIntegerField(db_column='LAST_UPDATED_BY', blank=True, null=True)  # Field name made lowercase.
    LAST_UPDATE_LOGIN = models.BigIntegerField(db_column='LAST_UPDATE_LOGIN', blank=True, null=True)  # Field name made lowercase.
    CREATED_BY = models.BigIntegerField(db_column='CREATED_BY', blank=True, null=True)  # Field name made lowercase.
    BILL_FROM_AFFILIATE_CODE = models.CharField(db_column='BILL_FROM_AFFILIATE_CODE', max_length=4, blank=True, null=True)  # Field name made lowercase.
    LINE_NO = models.BigIntegerField(db_column='LINE_NO', blank=True, null=True)  # Field name made lowercase.
    SHIPMENT_NO = models.BigIntegerField(db_column='SHIPMENT_NO', blank=True, null=True)  # Field name made lowercase.
    OPTION_NO = models.BigIntegerField(db_column='OPTION_NO', blank=True, null=True)  # Field name made lowercase.
    COMPONENT_NO = models.BigIntegerField(db_column='COMPONENT_NO', blank=True, null=True)  # Field name made lowercase.
    LINE_STATUS_CODE = models.CharField(db_column='LINE_STATUS_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    TOP_MODEL_LINE_ID = models.BigIntegerField(db_column='TOP_MODEL_LINE_ID', blank=True, null=True)  # Field name made lowercase.
    ITEM_TYPE_CODE = models.CharField(db_column='ITEM_TYPE_CODE', max_length=30, blank=True, null=True)  # Field name made lowercase.
    NEW_GSCP_TRANSFER_FLAG = models.CharField(db_column='NEW_GSCP_TRANSFER_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    NEW_GSCP_TRANSFER_DATE = models.DateField(db_column='NEW_GSCP_TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'xxgerp_sales_ots_so_info'


class XxgerpFinGlJournal(models.Model):
    legal_entity_name = models.CharField(db_column='LEGAL_ENTITY_NAME', max_length=240, blank=True, null=True)  # Field name made lowercase.
    ledger_id = models.BigIntegerField(db_column='LEDGER_ID', blank=True, null=True)  # Field name made lowercase.
    affiliate_code = models.CharField(db_column='AFFILIATE_CODE', max_length=4, blank=True, null=True)  # Field name made lowercase.
    je_batch_id = models.BigIntegerField(db_column='JE_BATCH_ID', primary_key=True)  # Field name made lowercase.
    je_header_id = models.BigIntegerField(db_column='JE_HEADER_ID')  # Field name made lowercase.
    je_line_no = models.BigIntegerField(db_column='JE_LINE_NO')  # Field name made lowercase.
    segment1 = models.CharField(db_column='SEGMENT1', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment1_desc = models.CharField(db_column='SEGMENT1_DESC', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment2 = models.CharField(db_column='SEGMENT2', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment2_desc = models.CharField(db_column='SEGMENT2_DESC', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment3 = models.CharField(db_column='SEGMENT3', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment3_desc = models.CharField(db_column='SEGMENT3_DESC', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment4 = models.CharField(db_column='SEGMENT4', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment5 = models.CharField(db_column='SEGMENT5', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment6 = models.CharField(db_column='SEGMENT6', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment7 = models.CharField(db_column='SEGMENT7', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment8 = models.CharField(db_column='SEGMENT8', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment9 = models.CharField(db_column='SEGMENT9', max_length=100, blank=True, null=True)  # Field name made lowercase.
    segment10 = models.CharField(db_column='SEGMENT10', max_length=100, blank=True, null=True)  # Field name made lowercase.
    effective_date = models.DateField(db_column='EFFECTIVE_DATE', blank=True, null=True)  # Field name made lowercase.
    posted_date = models.DateField(db_column='POSTED_DATE', blank=True, null=True)  # Field name made lowercase.
    period_name = models.CharField(db_column='PERIOD_NAME', max_length=15, blank=True, null=True)  # Field name made lowercase.
    gl_je_batch_name = models.CharField(db_column='GL_JE_BATCH_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    gl_je_header_name = models.CharField(db_column='GL_JE_HEADER_NAME', max_length=100, blank=True, null=True)  # Field name made lowercase.
    user_je_source_name = models.CharField(db_column='USER_JE_SOURCE_NAME', max_length=25, blank=True, null=True)  # Field name made lowercase.
    user_je_category_name = models.CharField(db_column='USER_JE_CATEGORY_NAME', max_length=40, blank=True, null=True)  # Field name made lowercase.
    group_id = models.BigIntegerField(db_column='GROUP_ID', blank=True, null=True)  # Field name made lowercase.
    sub_batch_name = models.CharField(db_column='SUB_BATCH_NAME', max_length=30, blank=True, null=True)  # Field name made lowercase.
    je_header_name = models.CharField(db_column='JE_HEADER_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    receipt_no = models.CharField(db_column='RECEIPT_NO', max_length=30, blank=True, null=True)  # Field name made lowercase.
    customer_name = models.CharField(db_column='CUSTOMER_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    customer_code = models.CharField(db_column='CUSTOMER_CODE', max_length=40, blank=True, null=True)  # Field name made lowercase.
    je_line_desc = models.CharField(db_column='JE_LINE_DESC', max_length=100, blank=True, null=True)  # Field name made lowercase.
    accounted_dr = models.BigIntegerField(db_column='ACCOUNTED_DR', blank=True, null=True)  # Field name made lowercase.
    accounted_cr = models.BigIntegerField(db_column='ACCOUNTED_CR', blank=True, null=True)  # Field name made lowercase.
    creation_user_name = models.CharField(db_column='CREATION_USER_NAME', max_length=300, blank=True, null=True)  # Field name made lowercase.
    transfer_flag = models.CharField(db_column='TRANSFER_FLAG', max_length=1, blank=True, null=True)  # Field name made lowercase.
    transfer_date = models.DateField(db_column='TRANSFER_DATE', blank=True, null=True)  # Field name made lowercase.
    global_unique_id = models.CharField(db_column='GLOBAL_UNIQUE_ID', max_length=100, blank=True, null=True)  # Field name made lowercase.
    bam_sequence_id = models.BigIntegerField(db_column='BAM_SEQUENCE_ID', blank=True, null=True)  # Field name made lowercase.
    old_global_unique_id = models.CharField(db_column='OLD_GLOBAL_UNIQUE_ID', max_length=100, blank=True, null=True)  # Field name made lowercase.
    creation_date = models.DateField(db_column='CREATION_DATE', blank=True, null=True)  # Field name made lowercase.
    created_by = models.BigIntegerField(db_column='CREATED_BY', blank=True, null=True)  # Field name made lowercase.
    last_update_date = models.DateField(db_column='LAST_UPDATE_DATE', blank=True, null=True)  # Field name made lowercase.
    last_updated_by = models.BigIntegerField(db_column='LAST_UPDATED_BY', blank=True, null=True)  # Field name made lowercase.
    last_update_login = models.BigIntegerField(db_column='LAST_UPDATE_LOGIN', blank=True, null=True)  # Field name made lowercase.
    context = models.CharField(db_column='CONTEXT', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute1 = models.CharField(db_column='ATTRIBUTE1', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute2 = models.CharField(db_column='ATTRIBUTE2', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute3 = models.CharField(db_column='ATTRIBUTE3', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute4 = models.CharField(db_column='ATTRIBUTE4', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute5 = models.CharField(db_column='ATTRIBUTE5', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute6 = models.CharField(db_column='ATTRIBUTE6', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute7 = models.CharField(db_column='ATTRIBUTE7', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute8 = models.CharField(db_column='ATTRIBUTE8', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute9 = models.CharField(db_column='ATTRIBUTE9', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute10 = models.CharField(db_column='ATTRIBUTE10', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute11 = models.CharField(db_column='ATTRIBUTE11', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute12 = models.CharField(db_column='ATTRIBUTE12', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute13 = models.CharField(db_column='ATTRIBUTE13', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute14 = models.CharField(db_column='ATTRIBUTE14', max_length=150, blank=True, null=True)  # Field name made lowercase.
    attribute15 = models.CharField(db_column='ATTRIBUTE15', max_length=150, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'xxgerp_fin_gl_journal'
        unique_together = (('je_batch_id', 'je_header_id', 'je_line_no'),)


class XxgerpFinGlJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = XxgerpFinGlJournal
        fields = '__all__'