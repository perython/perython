#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.contrib import messages
from django.db.models import Q
from django.http import Http404
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.list import ListView
\
from book.models import Book
from book.forms import BookAddForm

class BooksView(ListView):
    template_name = 'books.html'
    model = Book
    queryset = Book.objects.filter(~Q(status='HD')).order_by('-date_read')
    context_object_name = 'books'
    
    def get_context_data(self, **kwargs):
        context = super(BooksView, self).get_context_data(**kwargs)
        context['total_read'] = len(Book.objects.filter(status='FN'))
        return context

class BookAddEdit(object):
    template_name = 'admin/add_edit_object.html'
    form_class = BookAddForm
    model = Book
    success_url = '/bookshelf/'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            raise Http404
        return super(BookAddEdit, self).dispatch(request, *args, **kwargs)
    
    def get_form_kwargs(self):
        kwargs = super(BookAddEdit, self).get_form_kwargs()
        kwargs.update({'auto_id': False})
        return kwargs
    
class BookAddView(BookAddEdit, CreateView):
    def get_context_data(self, **kwargs):
        context = super(BookAddView, self).get_context_data(**kwargs)
        context['object_name'] = 'Add book'
        return context

class BookEditView(BookAddEdit, UpdateView):
    def get_context_data(self, **kwargs):
        context = super(BookEditView, self).get_context_data(**kwargs)
        context['object_name'] = 'Edit book'
        return context
    
