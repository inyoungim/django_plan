import cx_Oracle
from django.db import connection, connections
from django.db.models import Case, When, F
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import serializers, exceptions
from rest_framework.decorators import api_view

from ..models import NavMenu, NavMenuAcl


class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavMenu
        #fields = '__all__'
        fields = ['id', 'name', 'path', 'acl_inherit', 'parent_id', 'level', 'tree_id', 'lft', 'rght']


def menuIndex(request,site ):
    db_data = NavMenu.objects.using(site).all()
    serializer = DataSerializer(db_data, many=True)
    data = { "menuList": serializer.data, }
    return JsonResponse(data, safe=False)


class AclSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavMenuAcl
        fields = ['parent_id','id', 'acl_target', 'acl_target_name', 'acl_target_name_en', 'acl_value', 'acl_value_name']


def make_dict(cursor):
    column_names = [d[0] for d in cursor.description]

    def create_row(*args):
        return dict(zip(column_names, args))
    return create_row


@api_view(['GET'])
def getMenuParents(request, site, pk):
    # Fix current Year, current default Division
    id_list = []
    try:
        menu = NavMenu.objects.using(site).get(pk=pk)
        menu_list = menu.get_ancestors().using(site)
        for item in menu_list:
            id_list.append(item.id)
    except:
        pass
    data = {"idList": id_list}
    return JsonResponse(data, safe=False)


def get_acl(site,pk):
    ancestors = NavMenu.objects.using(site).get(pk=pk).get_ancestors(include_self=True).using(site)
    pidlist = []
    for item in reversed(ancestors):
        pidlist.append(item.id)
        if not item.acl_inherit:
            break;
    db_data = NavMenuAcl.objects.using(site).filter(parent_id__in=pidlist)
    serializer = AclSerializer(db_data, many=True)
    data = {"aclList": serializer.data, 'pk': pk}
    return data;


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def acl(request,site ,pk):
    if request.method == "GET":
        data = get_acl(site, pk);
        return JsonResponse(data, safe=False)
    elif request.method == "POST":
        acl_target = request.POST.get('acl_target', '')
        acl_target_name = request.POST.get('acl_target_name', '')
        acl_target_name_en = request.POST.get('acl_target_name_en', '')
        acl_value = request.POST.get('acl_value', '')
        acl_value_name = request.POST.get('acl_value_name', '')

        old_data = NavMenuAcl.objects.using(site).filter(parent_id=pk, acl_target=acl_target)
        if old_data.count() > 0:
            message = "Target is duplicated. please, remove old data and try again."
            raise exceptions.ParseError(message)
        master = NavMenu.objects.using(site).get(pk=pk)
        db_data = NavMenuAcl(parent_id=pk,acl_target=acl_target,acl_target_name=acl_target_name,
                             acl_target_name_en=acl_target_name_en,
                             acl_value=acl_value, acl_value_name=acl_value_name )
        db_data.master=master
        db_data.save(using=site)

        data = get_acl(site, pk);
        return JsonResponse(data, safe=False)

    elif request.method == "DELETE":
        aclid = request.GET.get('aclid', '')
        try:
            db_data = NavMenuAcl.objects.using(site).get(id=aclid)
            db_data.delete()
        except:
            pass

        data = get_acl(site, pk);
        return JsonResponse(data, safe=False)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def menuDetail(request,site , pk):
    if request.method == "GET":
        menu_item = NavMenu.objects.using(site).get(id=pk)
        parent_id = request.GET.get('pid', menu_item.parent_id)
        position = request.GET.get('position', 'last')

        parent = NavMenu.objects.using(site).get(id=parent_id)

        if position == 'first':
            menu_item.move_to(parent, position='first-child')
            menu_item.save(using=site)
        elif position == 'last':
            menu_item.move_to(parent, position='last-child')
            menu_item.save(using=site)
        elif position == 'up':
            try:
                parent = NavMenu.objects.using(site).get(parent_id=menu_item.parent_id, rght=menu_item.lft - 1)
                menu_item.move_to(parent, position='left')
                menu_item.save(using=site)
            except:
                pass
        elif position == 'down':
            try:
                parent = NavMenu.objects.using(site).get(parent_id=menu_item.parent_id, lft=menu_item.rght + 1)
                menu_item.move_to(parent, position='right')
                menu_item.save(using=site)
            except:
                pass

        data = {}
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        name = request.POST.get('name', '')
        acl_inherit = request.POST.get('aot', False) in ["true", "True"]
        path = request.POST.get('path', '')
        if path == 'undefined': path = ''
        if pk > 0:
            parent = NavMenu.objects.using(site).get(id=pk)
            menu_item = NavMenu(name=name, path=path, acl_inherit=acl_inherit)
            # menu_item.insert_at(parent, position='last-child', save=True)
            # insert_at 은 multi database 동작하지 않음 --> save 후 connections[site] 를 이용한 raw sql 사용

            menu_item.parent = parent
            menu_item.tree_id = parent.tree_id
            menu_item.level = parent.level + 1
            menu_item.lft = parent.rght
            menu_item.rght = parent.rght + 1
            menu_item.save(using=site)
            with connections[site].cursor() as cursor:
                cursor.execute(f"""
                    UPDATE navMenu_navmenu 
                    SET lft = CASE
                            WHEN lft > {parent.rght-1}
                                THEN lft + 2
                            ELSE lft END,
                        rght = CASE
                            WHEN rght > {parent.rght-1}
                                THEN rght + 2
                            ELSE rght END
                    WHERE tree_id = {parent.tree_id}
                        AND (lft > {parent.rght-1} OR rght > {parent.rght-1})
                        AND id != {menu_item.id}
                    """)

        else:
            menu_item = NavMenu(name=name, path=path, acl_inherit=acl_inherit)
            menu_item._tree_manager._db = site
            menu_item.save(using=site)

        serializer = DataSerializer(menu_item)
        data = {"addedMenu": serializer.data, }
        return JsonResponse(data, safe=False)
    elif request.method == "PUT":
        name = request.POST.get('name', '')
        acl_inherit = request.POST.get('aot', False) in ["true", "True"]
        path = request.POST.get('path', '')
        menu_item = NavMenu.objects.using(site).get(id=pk)
        menu_item.name = name
        menu_item.path = path
        menu_item.acl_inherit = acl_inherit
        # menu_item.parent_id = menu_item.parent_id
        menu_item.save(using=site)

        data = {}
        return JsonResponse(data, safe=False)
    elif request.method == "DELETE":  # delete
        menu_item = NavMenu.objects.using(site).get(pk=pk)
        # delete 은 multi database 동작하지 않음 --> delete 시 connections[site] 를 이용한 raw sql 사용
        with connections[site].cursor() as cursor:
            cursor.execute(f"""
                UPDATE navMenu_navmenu 
                SET lft = CASE
                        WHEN lft > {menu_item.rght}
                            THEN lft - ({menu_item.rght}-{menu_item.lft}+1)
                        ELSE lft END,
                    rght = CASE
                        WHEN rght > {menu_item.rght}
                            THEN rght - ({menu_item.rght}-{menu_item.lft}+1)
                        ELSE rght END
                WHERE tree_id = {menu_item.tree_id}
                    AND (lft > {menu_item.rght} OR rght > {menu_item.rght})
                """)
            cursor.execute(f"DELETE FROM navMenu_navmenu WHERE id = {menu_item.id}")
        data = {}
        return JsonResponse(data, safe=False)
    else:
        return render(request, "base/405.html", status=405)


"""
from mptt.templatetags.mptt_tags import cache_tree_children
def recursive_node_to_dict(node):
    result = {
        'id': node.id,
        'name': node.name,
        'parent_id':node.parent_id,
        'level':node.level,
    }
    children = [recursive_node_to_dict(c) for c in node.get_children()]
    if children:
        result['children'] = children
    return result


def recursive_node_index(request):
    db_data = NavMenu.objects.all()
    root_nodes = cache_tree_children(db_data)
    dicts = []
    for n in root_nodes:
        dicts.append(recursive_node_to_dict(n))
    data_list = {'name': 'root', 'children': dicts}
    print(f">> {data_list}")

    data = {
        "treeData": data_list,
    }
    return JsonResponse(data, safe=False)
"""
