from django.contrib import admin
from portfolio.models import *

class PostMyProject(admin.ModelAdmin):
    search_fields = ('name', 'description', 'date_created')
    date_hierarchy = 'date_created'

admin.site.register(MyProject, PostMyProject)
  