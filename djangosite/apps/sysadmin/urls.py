from django.urls import path, include
from . import views

urlpatterns = [
    path('switch/', views.switchuser),
    path('switch/api/', include('apps.sysadmin.api.urls')),
    path('customDivision/', views.customDivision),
    path('customDivision/api/', include('apps.sysadmin.api.urls')),
]
