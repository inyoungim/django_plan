from django.urls import path, include
from . import views
from ...navMenu.api import views as nav_menu_api

urlpatterns = [
    path('lineChart/<int:pk>', views.line_chart),
    path('pieChart/<int:pk>', views.pie_chart),
    path('detailLists/<int:pk>', views.detailLists),
    path('getMenuParents/<int:pk>', nav_menu_api.getMenuParents )
]
