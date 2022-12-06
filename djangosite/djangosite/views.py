import os

from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import JsonResponse
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view


# django start page
def startpage(request):
    return redirect('/hq/')


def ie_browser(request,site):
    return render(request, f"base/ie_browser.html")


def index(request,site):
    return render(request, f"base/{site}_index.html")


def startapp(request,site,pk):
    boardid = request.GET.get('boardid','')
    request.session['boardid'] = boardid

    menuPath = ''
    for menu in request.menu_list:
        if pk == menu.id:
            menuPath = menu.path
            break
    if menuPath == '':
        return render(request, "base/405.html", status=405)
    return redirect(menuPath)


def handler404(request, exception):
    return render(request, "base/404.html", status=404)


def handler500(request):
    return render(request, "base/500.html", status=500)


@api_view(['POST'])
def fileupload(request):
    '''
    개발환경에서 file upload 를 위해 fileupload function 생성
    운영환경에서는 /cg/fileupload.py 를 direct 로 호출함
    '''
    if request.method == "POST":  # save
        location = '/WEB_ROOT/DATA/temp/'
        ipaddress = request.META.get('REMOTE_ADDR')
        file = request.FILES["file"]
        fs = FileSystemStorage(location=location)
        extension = os.path.splitext(str(file))[1]
        seqno = 0;
        while True:
            seqno += 1
            if not os.path.exists(f'{location}/{ipaddress}.{seqno}{extension}'):
                filename = f'{ipaddress}.{seqno}{extension}'
                break
        fs.save(filename, file)
        data = {'result': True, 'filename': filename}
        return JsonResponse(data, safe=False)
    else:
        data = {'result': False, 'filename': ''}
        return JsonResponse(data, safe=False)


@api_view(['POST'])
def KEditorFileUpload(request):
    '''
    개발환경에서 KEditor file upload 를 위해 fileupload function 생성
    운영환경에서는 /cg/fileupload.py 를 direct 로 호출함
    '''
    if request.method == "POST":  # save
        location = '/WEB_ROOT/DjangoWeb/djangosite/static/KETempImages/'
        ipaddress = request.META.get('REMOTE_ADDR')
        image = request.FILES["%%File"]

        fs = FileSystemStorage(location=location)
        extension = os.path.splitext(str(image.name))[1]
        seqno = 0;
        while True:
            seqno += 1
            if not os.path.exists(f'{location}/{ipaddress}.{seqno}.{extension}'):
                filename = f'{ipaddress}.{seqno}.{extension}'
                break
        fs.save(filename, image)
        file_size = os.path.getsize(f'{location}/{filename}')

        data = {
            'fileName' : filename,
            'fileSize' : file_size,
            'url': f"/static/KETempImages/{filename}"
        }
        return JsonResponse(data=data, safe=False)
    else:
        data = {'result': False, 'filename': ''}
        return JsonResponse(data, safe=False)