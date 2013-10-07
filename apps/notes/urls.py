#!/usr/bin/env python
# coding: utf-8

from django.conf.urls import patterns
from notes.views import PostsView, PostView, PostAddView, PostEditView, PostsTaggedView

urlpatterns = patterns('',
	(r'^$', PostsView.as_view()),
	(r'^page(?P<page>\d+)/$', PostsView.as_view()),
	(r'^(?P<pk>\d{1,5})/$', PostView.as_view()),
    (r'^(?P<pk>\d{1,5})/edit/$', PostEditView.as_view()),
    (r'^add/$', PostAddView.as_view()),
    (r'^tagged/(?P<tag>[\w\W]+)/$', PostsTaggedView.as_view()),
)