from .base_settings import *
import mimetypes
import os

DEBUG = True
DEBUGTOOLBAR = False
SQLDEBUG = False
INTERNAL_IPS = ['127.0.0.1', ]
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
STATICFILES_DIRS = [BASE_DIR / "static", ]
DOMAIN = "ncrn"

mimetypes.add_type("application/javascript", ".js", True)

# override config for development environment at base_settings
#if DEBUGTOOLBAR:
#    INSTALLED_APPS += [ 'debug_toolbar',]
#    MIDDLEWARE += [
#        'debug_toolbar.middleware.DebugToolbarMiddleware',
#    ]

if SQLDEBUG:
    MIDDLEWARE += [
        'apps.middleware.apiDebugMiddleware.ApiDebugMiddleware',
    ]


eval_db = True
com_name = os.environ['COMPUTERNAME']
if com_name == 'HE-VLAB':
    eval_db = False

if eval_db :
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',  # mysqlclient librarly 설치
            'NAME': 'DJ_DEFAULT',
            'USER': 'cmuser',
            'PASSWORD': '',  # mariaDB 설치 시 입력한 root 비밀번호 입력
            'HOST': 'localhost',
            'PORT': '3306'
        },
        'hq': {
            'ENGINE': 'django.db.backends.mysql',  # mysqlclient librarly 설치
            'NAME': 'HQ',
            'USER': 'hquser',
            'PASSWORD': '',  # mariaDB 설치 시 입력한 root 비밀번호 입력
            'HOST': 'localhost',
            'PORT': '3306'
        },
    }


# API call 시 DB query 문 debugging 시 필요
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        # 모든 sql 문을 출력할 경우 'django.db.backends' 활성화
        #'django.db.backends': {
        #    'handlers': ['console'],
        #    'level': 'DEBUG',
        #},

        # api 가 호출될때만 sql 출력할 경우 'api' 활성화 후
        # import logging
        # logger = logging.getLogger('api')
        # logger.debug(f'[ SQL ]{connection.queries[-1]["time"]} {db_data.query}') 로 출력
        'api': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    }
}