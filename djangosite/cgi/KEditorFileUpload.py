import os, cgi, cgitb
import json


def makedirs(path):
    try:
        os.makedirs(path)
    except OSError:
        if not os.path.isdir(path):
            raise


form = cgi.FieldStorage()
if (os.environ['REQUEST_METHOD'] != 'POST') or (not 'file' in form):
    data = {'result': 'false', 'filename': ''}
else:
    image = form["%%File"]
    location = "/WEB_ROOT/DjangoWeb/djangosite/static/KETempImages/"
    ipaddress = os.environ['REMOTE_ADDR']
    makedirs(location)
    extension = os.path.splitext(str(image.name))[1]
    seqno = 0
    while True:
        seqno += 1
        if not os.path.exists(f'{location}/{ipaddress}.{seqno}.{extension}'):
            filename = f'{ipaddress}.{seqno}.{extension}'
            break

    with open(f'{location}/{filename}', 'wb') as fout:
        while True:
            chunk = image.file.read(1024 * 1024)
            if not chunk:
                break
            fout.write(chunk)
    file_size = os.path.getsize(f'{location}/{filename}')

    data = {
        'fileName': filename,
        'fileSize': file_size,
        'url': f"/static/KETempImages/{filename}"
    }

print("Content-type:text/json; charset=UTF-8\n\n")
print(json.dumps(data))
