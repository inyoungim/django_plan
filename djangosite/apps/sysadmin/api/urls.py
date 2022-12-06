from django.urls import path, include
from . import views
from ...common.api import views as common_api

urlpatterns = [
    path('list/', views.index),
    path('detail/<int:pk>', views.detail),
    path('userinfo', common_api.userinfo)
]
