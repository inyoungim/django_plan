# Generated by Django 4.0 on 2022-09-08 07:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserCustomDivision',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_no', models.IntegerField(default=0)),
                ('div_name', models.CharField(max_length=50)),
                ('org_code', models.CharField(max_length=50)),
                ('org_name', models.CharField(blank=True, max_length=100)),
                ('org_name_en', models.CharField(blank=True, max_length=100)),
            ],
        ),
    ]