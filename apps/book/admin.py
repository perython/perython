from django.contrib import admin
from book.models import *

class BookAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'status', 'date_read', 'mark')
    search_fields = ('author', 'title', 'status', 'date_read')
    date_hierarchy = 'date_created'

admin.site.register(Book, BookAdmin)
