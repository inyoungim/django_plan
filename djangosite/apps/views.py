from django.shortcuts import redirect, render
from django.http import Http404


def index(request,site ):
    raise Http404("404 error")


def testpage(request,site ):
    return render(request, "temp/testpage.html")


''' Sample function with ipaddress and context
def sample(request):
    ipaddress = request.META['REMOTE_ADDR']
    context = {
        'ipaddress': ipaddress,
    }
    return render(request, "temp/sampe.html", context=context)
'''