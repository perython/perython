#!/usr/bin/env python
# coding: utf-8

from django.contrib import messages
from django.http import Http404
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.list import ListView
from notes.models import Post
from notes.forms import PostAddForm

class Posts(object):
    template_name = 'notes_list.html'
    context_object_name = 'notes'
    paginate_by = 10

class PostsView(Posts, ListView):
    model = Post
    queryset = Post.objects.all().order_by('-date_created')

    def get_queryset(self):
        """
        Get posts for the current page
        excluding hidden ones for public users.
        """
        queryset = super(Posts, self).get_queryset()
        if not self.request.user.is_authenticated():
            return queryset.exclude(visible=False)
        return queryset
    
class PostsTaggedView(Posts, ListView):

    def get_queryset(self):
        queryset = Post.objects.filter(tags__name__in=[self.kwargs['tag']]).order_by('-date_created')
        if not self.request.user.is_authenticated():
            return queryset.exclude(visible=False)
        return queryset

    def get_context_data(self, **kwargs):
        context = super(PostsTaggedView, self).get_context_data(**kwargs)
        context['cur_tag'] = self.kwargs['tag']
        return context

class PostView(DetailView):
    model = Post
    template_name = 'notes_item.html'
    context_object_name = 'note'

    def get_object(self, queryset=None):
        obj = super(PostView, self).get_object(queryset)
        if not (obj.visible or self.request.user.is_authenticated()):
            raise Http404
        return obj

    def get_context_data(self, **kwargs):
        context = super(PostView, self).get_context_data(**kwargs)
        try:
            context['note_prev'] = context['note'].get_previous_by_date_created()
        except Post.DoesNotExist:
            pass
        try:
            context['note_next'] = context['note'].get_next_by_date_created()
        except Post.DoesNotExist:
            pass
        return context

class PostAddEdit(object):
    template_name = 'admin/add_edit_object.html'
    form_class = PostAddForm
    model = Post
    success_url = '/notes/'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            raise Http404
        return super(PostAddEdit, self).dispatch(request, *args, **kwargs)
    
    def get_form_kwargs(self):
        kwargs = super(PostAddEdit, self).get_form_kwargs()
        kwargs.update({'auto_id': False})
        return kwargs
    
class PostAddView(PostAddEdit, CreateView):
    def get_context_data(self, **kwargs):
        context = super(PostAddView, self).get_context_data(**kwargs)
        context['object_name'] = 'Add note'
        return context

class PostEditView(PostAddEdit, UpdateView):
    def get_context_data(self, **kwargs):
        context = super(PostEditView, self).get_context_data(**kwargs)
        context['object_name'] = 'Edit note'
        return context
