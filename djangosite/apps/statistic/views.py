from django.shortcuts import redirect, render


def index(request,site ):
    return render(request, "statistic/dashboard.html")