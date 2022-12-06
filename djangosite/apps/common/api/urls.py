from django.urls import path
from . import views

urlpatterns = [
    path('loadPopup', views.loadPopup),
    path('popupFileDownload/<int:fid>', views.popupFileDownload),
]
def ImageUploadKEditor(request,):
    div_name = request.GET.get('div_name', '')
    print(request.GET)
    return JsonResponse(data={}, safe=False)