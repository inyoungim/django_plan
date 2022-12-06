from django import template
from django.contrib.sites import requests

register = template.Library()

"""
inclusion_tag : data 를 이용하여 template.html 만들어서 return

사용방법 1 : 기본 인자로 context 를 인수로 받아 context 에 new_name key 로 data 추가하여 반환
@register.inclusion_tag('template.html', takes_context=True)
def User_defined_function(context):
    context['new_name'] = class_name.objects.all()
    return context


사용방법 2 : 기본 인자없이 함수를 작성할때 dict 형으로 data 정의 후 반환
@register.inclusion_tag('template.html')
def User_defined_function():
    context = {'categories': Category.objects.all()}
    return context

"""

from ..models import NavMenu


@register.inclusion_tag('menu/navigation_menu.html', takes_context=True)
def show_navigation(context):
    context['navi_menu'] = NavMenu.objects.using(requests.preset['site']).all()
    return context



"""
simple_tag : 단순 list 결과를 return

사용방법 : 기본 인자 없이 함수를 작성할때 list 형으로 data 정의 후 반환
           인자를 받아서 가공한 후 반환 가능
@register.simple_tag()
def User_defined_function():
    menus = [
        {'name': "Home", 'level':1, 'link': "/" },
        {'name': "Board", 'level':1, 'link': "/apps/boards/index"},
        {'name': "Menu2", 'level':1, 'link': "/apps/menu2" },
    ]
    return menus
"""
