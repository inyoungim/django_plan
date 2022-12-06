from django.db.models import Max
from django.urls import reverse
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel
from django.db import models, connection


class NavMenu(MPTTModel):
    name = models.CharField(max_length=50)
    parent = TreeForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        db_index=True,
        on_delete=models.CASCADE
    )
    path = models.CharField(max_length=200, blank=True)
    acl_inherit = models.BooleanField(default=True)

    class Meta:
        unique_together = ['parent', 'id']

    class MPTTMeta:
        order_insertion_by = ['id']

    def get_navi_path(self, site, acl_target):
        try:
            ancestors = self.get_ancestors(include_self=True).using(site)
        except:
            ancestors = list()

        path = ""
        parent_id_list = []
        parent_acl_search = True
        top_menu_id = 0;
        for item in ancestors.reverse():
            if item.path != f'/{site}/':
                if path == "":
                    path = item.name
                else:
                    path = item.name + " > " + path

            # acl 조회를 위한 parent_id list 조회
            if parent_acl_search:
                parent_id_list.append(item.id)
            if not item.acl_inherit:
                parent_acl_search = False

            if item.level == 1:
                top_menu_id = item.id

        try:
            max_acl = NavMenuAcl.objects.using(site).filter(parent_id__in=parent_id_list, acl_target__in=acl_target)\
                        .aggregate(acl_value=Max('acl_value'))["acl_value"]
        except:
            max_acl = 0

        if max_acl is None:
            max_acl = 0

        return [ path, max_acl, top_menu_id ]


class NavMenuAcl(models.Model):
    parent = models.ForeignKey('NavMenu', on_delete=models.CASCADE, db_index=True)
    # acl_type = models.CharField(max_length=20)
    acl_target = models.CharField(max_length=50)
    acl_target_name = models.CharField(max_length=100)
    acl_target_name_en = models.CharField(max_length=100)
    acl_value = models.IntegerField()
    acl_value_name = models.CharField(max_length=20)

    class Meta:
        unique_together = ['parent', 'acl_target']

    def get_max_acl(self, acl_target):
        max_acl = 0
        for acl_item in acl_target:
            if self.acl_target == acl_item:
                if self.acl_value > max_acl:
                    max_acl = self.acl_value
        return max_acl
