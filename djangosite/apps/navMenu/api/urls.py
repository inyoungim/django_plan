from django.urls import path, include
from . import views
from ...common.api import views as common_api

urlpatterns = [
    path('menuIndex', views.menuIndex),
    path('acl/<int:pk>', views.acl),
    path('menuDetail/<int:pk>', views.menuDetail),
    path('getMenuParents/<int:pk>', views.getMenuParents),
    path('userinfo', common_api.userinfo)
]
