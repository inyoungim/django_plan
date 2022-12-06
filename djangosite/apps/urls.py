from django.urls import path, include
from . import views

urlpatterns = [
    path('common/',include('apps.common.urls')),
    path('sysadmin/', include('apps.sysadmin.urls')),
    path('navMenu/', include('apps.navMenu.urls')),
    path('boards/', include('apps.boards.urls')),
    path('statistic/', include('apps.statistic.urls')),
    path('royalty/', include('apps.royalty.urls')),
    path('testpage/', views.testpage),
]