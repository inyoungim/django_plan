from .base_settings import *

DEBUG = False
SQLDEBUG = False
ALLOWED_HOSTS = ['127.0.0.1', '156.147.61.115', 'ncrn.lge.com']
DOMAIN = "ncrn"

SILK_ENABLE = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # mysqlclient librarly 설치
        'NAME': 'DJ_DEFAULT',
        'USER': 'cmuser',
        'PASSWORD': 'rnjsdhdud1@',  # mariaDB 설치 시 입력한 root 비밀번호 입력
        'HOST': 'localhost',
        'PORT': '3306'
    },
    'cm': {
        'ENGINE': 'django.db.backends.mysql',  # mysqlclient librarly 설치
        'NAME': 'CM',
        'USER': 'cmuser',
        'PASSWORD': 'rnjsdhdud1@',  # mariaDB 설치 시 입력한 root 비밀번호 입력
        'HOST': 'localhost',
        'PORT': '3306'
    },
    'hq': {
        'ENGINE': 'django.db.backends.mysql',  # mysqlclient librarly 설치
        'NAME': 'HQ',
        'USER': 'hquser',
        'PASSWORD': 'rnjsdhdud1@',  # mariaDB 설치 시 입력한 root 비밀번호 입력
        'HOST': 'localhost',
        'PORT': '3306'
    },
}

'''
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'formatters': {
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {message}',
            'style': '{',
        },
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        },
        'django.server': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'file': {
            'level': 'INFO',
            'encoding': 'utf-8',
            'filters': ['require_debug_false'],
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs/djangosite.log',
            'maxBytes': 1024*1024*5,  # 5 MB
            'backupCount': 5,
            'formatter': 'standard',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'mail_admins', 'file'],
            'level': 'INFO',
        },
        'django.server': {
            'handlers': ['django.server'],
            'level': 'INFO',
            'propagate': False,
        },
        'log': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    }
}
'''