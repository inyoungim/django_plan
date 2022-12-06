"""djangosite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import path, include
from django.views.generic import RedirectView

from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url("favicon.ico")),),
    path('', views.startpage),
    path('<str:site>/', views.index),
    path('<str:site>/ie/', views.ie_browser),
    path('<str:site>/apps/', include('apps.urls')),
    path('<str:site>/appid/<int:pk>/', views.startapp),
    path('<str:site>/link/', include('apps.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

""" Custom Error Handler """
handler404 = 'djangosite.views.handler404'
handler500 = 'djangosite.views.handler500'

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
        path('cgi/fileupload.py', views.fileupload), # 개발 모드에서 동작을 위해 설정
        path('cgi/KEditorFileUpload.py', views.KEditorFileUpload),  # 개발 모드에서 동작을 위해 설정
    ]
