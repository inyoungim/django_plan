from django.http import HttpResponse
from django.shortcuts import render


def index(request,site ):
    return render(request, "royalty/royaltyTemplate.html")