import subprocess

from django.core.management.base import BaseCommand
import os, re

from djangosite.base_settings import BASE_DIR


class Command(BaseCommand):
    help = 'vue directory version up : specified new version no. : python.exe manage.py 0.2'

    def add_arguments(self, parser):
        parser.add_argument('ver', default='0.1', type=str)

    def handle(self, *args, **options):
        ver = options['ver']

        old_vue_version = ""
        new_vue_version = ""
        changed_count = 0

        print(f"{BASE_DIR.parent}")

        for (path, dir, files) in os.walk("./apps/"):
            path = path.replace("\\", "/")
            for dirname in dir:
                m = re.search('vue(.*)', dirname)
                if m :
                    old_vue_version = m.group()
                    new_vue_version = f"vue-v{ver}"
                    if old_vue_version != new_vue_version:
                        changed_count += 1
                        os.rename(f"{path}/{old_vue_version}", f"{path}/{new_vue_version}")
                        print(f"{path}/{old_vue_version} ==> {path}/{new_vue_version}")

        if changed_count > 0:
            command = subprocess.Popen([
                "python.exe", f"{BASE_DIR}/manage.py", "collectstatic", "--noinput", "--clear"],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            output, errors = command.communicate()
            command.wait()
            try:
                os.rmdir(f"{BASE_DIR.parent}/virtual_static/{old_vue_version}/js")
                os.rmdir(f"{BASE_DIR.parent}/virtual_static/{old_vue_version}")
            except:
                pass

            print("\n\n==========================================================")
            print(f"{changed_count} vue folders is changed : {old_vue_version} -> {new_vue_version}\n")
            print(f" 아래 명령어 실행 할 것")
            print(f" 1. (apps) 폴더 에서 Replace in Files : {old_vue_version} -> {new_vue_version}")
            print(f" 2. 소스 수정")
            print(f" 3. git commit 시 반드시 {new_vue_version} 폴더의 *.vue, *.js 파일 추가")
            print("==========================================================")
        else:
            print(f"There is no folder to replace.")