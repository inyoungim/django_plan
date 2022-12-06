from django.urls import path, include
from . import views

urlpatterns = [
    path('<int:bid>/', views.index),
    path('<int:bid>/api/', include('apps.boards.api.urls')),
    path('master/', views.master),
    path('master/api/', include('apps.boards.api.urls')),
    path('popup/', views.popup),
    path('popup/api/', include('apps.boards.api.urls')),
]
