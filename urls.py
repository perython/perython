#!/usr/bin/env python
# coding: utf-8

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.auth.views import login, logout
from django.views.generic.base import RedirectView
from forms import CustomAuthenticationForm
from views import ContactsView

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', login, {'template_name':'admin/login.html', 'authentication_form': CustomAuthenticationForm}),
    url(r'^logout/$', logout, {'next_page':'/'}),
    url(r'^notes/', include('notes.urls')),
    url(r'^contacts/$', ContactsView.as_view()),
    url(r'^portfolio/', include('portfolio.urls')),
    url(r'^translateit/', include('translateit.urls')),
    url(r'^$', RedirectView.as_view(url='/contacts/')),
    url(r'^bookshelf/', include('book.urls')),
    url(r'^map/', include('mapit.urls')),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
