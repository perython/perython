#!/usr/bin/env python
# coding: utf-8
from __future__ import unicode_literals

from django.views.generic.list import ListView
from . import STATUS_IN_PROGRESS, STATUS_FINISHED
from .models import Book


class BooksView(ListView):
    template_name = 'books.html'
    model = Book
    queryset = Book.objects.order_by('-date_finished')
    context_object_name = 'books'

    def get_context_data(self, **kwargs):
        context = super(BooksView, self).get_context_data(**kwargs)
        context['STATUS_IN_PROGRESS'] = STATUS_IN_PROGRESS
        context['total_finished'] = Book.objects.filter(status=STATUS_FINISHED).count()
        return context
