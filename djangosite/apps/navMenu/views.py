from django.shortcuts import render


def index(request,site):
    return render(request, "menu/menuControl.html")

