from django.db import models


class UserCustomDivision(models.Model):
    order_no = models.IntegerField(default=0)
    div_name = models.CharField(max_length=50)
    org_code = models.CharField(max_length=50)
    org_name = models.CharField(max_length=100, blank=True)
    org_name_en = models.CharField(max_length=100, blank=True)