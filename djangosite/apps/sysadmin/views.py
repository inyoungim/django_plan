from django.shortcuts import redirect, render
from django.http import Http404


def switchuser(request,site ):
    return render(request, "sysadmin/switchUser.html")


def customDivision(request,site ):
    return render(request, "sysadmin/customDivision.html")
