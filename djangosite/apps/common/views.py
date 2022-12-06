from django.shortcuts import redirect, render
from django.http import Http404


def index(request,site ):
    raise Http404("404 error")
