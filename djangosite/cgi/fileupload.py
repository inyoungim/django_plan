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
    form_file = form['file']
    location = "/WEB_ROOT/DATA/temp/"
    ipaddress = os.environ['REMOTE_ADDR']
    makedirs(location)
    extension = os.path.splitext(str(form_file.filename))[1]
    seqno = 0
    while True:
        seqno += 1
        if not os.path.exists(f'{location}/{ipaddress}.{seqno}{extension}'):
            filename = f'{ipaddress}.{seqno}{extension}'
            break

    with open(f'{location}/{filename}', 'wb') as fout:
        while True:
            chunk = form_file.file.read(1024 * 1024)
            if not chunk:
                break
            fout.write(chunk)
    data = {'result': True, 'filename': filename}

print("Content-type:text/html\n\n")
print(json.dumps(data))
