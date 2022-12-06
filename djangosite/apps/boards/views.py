from django.shortcuts import render

from .models import BoardMaster


def index(request,site , bid):
    try:
        db_data = BoardMaster.objects.using(site).get(id=bid)
    except:
        db_data = {}

    context = {'board_master': db_data}
    return render(request, "boards/boardTemplate.html", context=context)


def master(request,site ):
    return render(request, "boards/boardManagement.html")


def popup(request,site ):
    return render(request, "boards/popupManagement.html")