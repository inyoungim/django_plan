from datetime import timedelta

from django.db import models
from django.utils import timezone
from rest_framework import serializers


class AccessHistory(models.Model):
    menu_id = models.IntegerField()
    menu_name = models.CharField(max_length=50)
    acc_type1 = models.CharField(max_length=50, blank=True)
    acc_type2 = models.CharField(max_length=50, blank=True)
    acc_type3 = models.CharField(max_length=50, blank=True)
    acc_type4 = models.CharField(max_length=2000, blank=True)
    acc_type5 = models.CharField(max_length=500, blank=True)
    user_empno = models.CharField(max_length=50, blank=True)
    user_name = models.CharField(max_length=50, blank=True)
    user_name_en = models.CharField(max_length=50, blank=True)
    user_mail = models.CharField(max_length=50, blank=True)
    user_posi = models.CharField(max_length=50, blank=True)
    user_posi_en = models.CharField(max_length=50, blank=True, null=True)
    user_org = models.CharField(max_length=100, blank=True)
    user_org_en = models.CharField(max_length=100, blank=True)
    acc_date = models.DateTimeField(default=timezone.now)


class MailingItem(models.Model):
    item_command = models.CharField(max_length=100)
    item_id = models.CharField(max_length=100)
    item_title = models.CharField(max_length=200, blank=True, null=True)
    item_comments = models.CharField(max_length=2000)
    from_user = models.CharField(max_length=200)
    to_user_list = models.CharField(max_length=2000)
    create_date = models.DateTimeField(default=timezone.now)


class AccessHistorySerializer(serializers.ModelSerializer):
    acc_date = serializers.SerializerMethodField('get_site_data')

    class Meta:
        model = AccessHistory
        fields = '__all__'

    def get_site_data(self, obj):
        site = self.context.get("site", '')
        if site == 'ic' or site == 'ic_dev':  # pytz.timezone('Asia/Jakarta')
            data = obj.acc_date + timedelta(hours=7)
        else:
            data = obj.acc_date + timedelta(hours=9)
        return data.strftime('%Y-%m-%d %H:%M:%S')