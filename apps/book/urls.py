#!/usr/bin/env python
# coding: utf-8
from __future__ import unicode_literals

from django.conf.urls import patterns, url
from .views import BooksView

urlpatterns = patterns(
    '',
    url(r'^$', BooksView.as_view(), name='bookshelf'),
)
