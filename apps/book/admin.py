#!/usr/bin/env python
# coding: utf-8
from __future__ import unicode_literals

from django.contrib import admin
from .models import Book


class BookAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'status', 'date_finished')
    search_fields = ('author', 'title', 'status', 'date_finished')
    date_hierarchy = 'date_created'

admin.site.register(Book, BookAdmin)
