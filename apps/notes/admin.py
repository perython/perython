#!/usr/bin/env python
# coding: utf-8

from django.contrib import admin
from notes.models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'date_created')
    search_fields = ('title', 'entry', 'date_created')
    date_hierarchy = 'date_created'

admin.site.register(Post, PostAdmin)
