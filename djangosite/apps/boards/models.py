from datetime import datetime
from django.db import models, connection
from django.utils import timezone


class BoardMaster(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000)
    board_type = models.CharField(max_length=10)
    board_mailing = models.CharField(max_length=1000, blank=True)
    reply_yn = models.BooleanField(default=False)
    comments_yn = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Board(models.Model):
    master = models.ForeignKey('BoardMaster', on_delete=models.CASCADE, db_index=True)
    parent_id = models.IntegerField(default=0)
    group_id = models.IntegerField(null=False)
    indent = models.IntegerField(default=0)
    order_no = models.IntegerField(default=1)
    div_name = models.CharField(max_length=50, default='')
    title = models.CharField(max_length=100)
    owner_empno = models.CharField(max_length=50)
    owner_mail = models.CharField(max_length=50)
    owner_name = models.CharField(max_length=50)
    owner_name_en = models.CharField(max_length=50)
    create_date = models.DateTimeField(default=timezone.now)
    modify_date = models.DateTimeField(default=timezone.now)
    group_modify_date = models.DateTimeField(default=timezone.now)
    hit_count = models.IntegerField(default=0)
    agree_count = models.IntegerField(default=0)
    answer_count = models.IntegerField(default=0)
    attached_count = models.IntegerField(default=0)
    contents = models.BinaryField(null=True)

    class Meta:
        unique_together = ['master', 'id']

    def __str__(self):
        return self.title


class BoardAttached(models.Model):
    parent = models.ForeignKey('Board', on_delete=models.CASCADE, db_index=True)
    order_no = models.IntegerField(default=1)
    file_name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    file_size = models.IntegerField()


class BoardComments(models.Model):
    parent = models.ForeignKey('Board', on_delete=models.CASCADE, db_index=True)
    comments = models.CharField(max_length=4000)
    owner_empno = models.CharField(max_length=50)
    owner_mail = models.CharField(max_length=50)
    owner_name = models.CharField(max_length=50)
    owner_name_en = models.CharField(max_length=50)
    create_date = models.DateTimeField(default=timezone.now)


class BoardPopup(models.Model):
    parent = models.ForeignKey('Board', on_delete=models.CASCADE, db_index=True)
    div_name = models.CharField(max_length=50, default='')
    target_id = models.IntegerField(blank=True)
    popup_sdate = models.DateField(null=True)
    popup_edate = models.DateField(null=True)