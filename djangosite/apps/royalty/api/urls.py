from django.urls import path, include
from . import views

urlpatterns = [
    path('royaltySearch/<int:pk>', views.royaltySearch),
    path('uploadExcel/<int:pk>', views.uploadExcel),
    path('columnItem/<int:pk>', views.columnItem),
    path('royaltyFormExcelDownload', views.royaltyFormExcelDownload),
]