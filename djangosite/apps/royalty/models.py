from django.db import models, connection
from django.db.models import Max

class columnMaster(models.Model):
    column_name = models.CharField(max_length=50)
    column_name_header = models.CharField(max_length=60)
    order_no = models.IntegerField(default=1)


class modelBasic(models.Model):
    sales_subsidiary = models.CharField(max_length=10, null=True)
    model_suffix = models.CharField(max_length=30)
    production_model_suffix = models.CharField(max_length=20, null=True)
    country = models.CharField(max_length=50, null=True)
    region = models.CharField(max_length=30, null=True)
    product_lv3 = models.CharField(max_length=40, null=True)
    product_lv4 = models.CharField(max_length=60, null=True)
    qty = models.IntegerField(default=1)
    period_name = models.CharField(max_length=10, default="202210")
    inch = models.CharField(max_length=5, default="55", null=True)
    series_name1 = models.CharField(max_length=5, default="", null=True)
    series_name2 = models.CharField(max_length=7, default="", null=True)
    series_name3 = models.CharField(max_length=12, default="", null=True)
    model_compr = models.CharField(max_length=15, default="", null=True)
    nano_initial = models.CharField(max_length=5, default="", null=True)
    t2 = models.CharField(max_length=2, default="", null=True)
    suffix = models.CharField(max_length=10, default="", null=True)
    suffix_country = models.CharField(max_length=2, default="", null=True)
    country_match = models.CharField(max_length=20, default="", null=True)
    region2 = models.CharField(max_length=10, default="", null=True)
    region1 = models.CharField(max_length=5, default="", null=True)
    mp3 = models.CharField(max_length=5, default="", null=True)
    tech = models.CharField(max_length=5, default="", null=True)
    nlp = models.CharField(max_length=5, default="", null=True)
    odm = models.CharField(max_length=5, default="", null=True)
    product_family = models.CharField(max_length=5, default="", null=True)
    model_id = models.CharField(max_length=50, default="", null=True)
    main_soc = models.CharField(max_length=20, default="", null=True)
    soc_co = models.CharField(max_length=10, default="", null=True)
    sw_service = models.CharField(max_length=30, default="", null=True)
    smart = models.CharField(max_length=10, default="", null=True)
    three_d = models.CharField(max_length=10, default="", null=True)
    mr = models.CharField(max_length=30, default="", null=True)
    wifi_bt = models.CharField(max_length=20, default="", null=True)
    analog = models.CharField(max_length=10, default="", null=True)
    year = models.CharField(max_length=5, default="", null=True)


class modelOption(models.Model):
    parent = models.ForeignKey('modelBasic', on_delete=models.CASCADE, db_index=True)
    order_no = models.IntegerField(default=0)
    column_name = models.CharField(max_length=200)
    column_data = models.CharField(max_length=1000, null=True)
    column_data_value = models.CharField(max_length=1000, null=True)


class modelSpec(models.Model):
    # parent = models.ForeignKey('modelBasic', on_delete=models.CASCADE, db_index=True)
    order_no = models.IntegerField(default=0)
    column_name = models.CharField(max_length=200)
    column_data = models.CharField(max_length=1000)
    column_data_value = models.CharField(max_length=1000, null=True)


class regionMaster(models.Model):
    code = models.CharField(max_length=7, null=True)
    country = models.CharField(max_length=40, null=True)
    region1 = models.CharField(max_length=10, null=True)
    year = models.CharField(max_length=10, null=True)
    mode = models.CharField(max_length=10)