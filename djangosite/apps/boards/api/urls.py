from django.urls import path, include
from . import views, mailing
from ...common.api import views as common_api

urlpatterns = [
    path('list', views.index),
    path('detail/<int:pk>', views.detail),
    path('comments/<int:pk>', views.comments),
    path('upload/<int:pk>', views.upload),
    path('download/<int:fid>', views.download),
    path('masterList', views.masterList),
    path('moveAbleList', views.moveAbleList),
    path('masterDetail/<int:pk>', views.masterDetail),
    path('popupList', views.popupList),
    path('popupDetail/<int:pk>', views.popupDetail),
    path('updatePopup/<int:pk>', views.updatePopup),
    path('sendmail/<int:doc_id>', mailing.sendmail),
    path('bid_userinfo', common_api.bid_userinfo),
    path('moveArticle', views.moveArticle),
]
