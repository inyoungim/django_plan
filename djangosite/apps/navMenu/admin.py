from django.contrib import admin

from .models import NavMenu, NavMenuAcl
from mptt.admin import DraggableMPTTAdmin

admin.site.register(NavMenu, DraggableMPTTAdmin)
admin.site.register(NavMenuAcl)