#!/usr/bin/env python
# coding: utf-8

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import RedirectView, TemplateView

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', RedirectView.as_view(url='/contacts/')),
    url(r'^notes/$', RedirectView.as_view(url='/contacts/')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^contacts/$', TemplateView.as_view(template_name='contacts.html'), name='contacts'),
    url(r'^portfolio/$', TemplateView.as_view(template_name='portfolio.html'), name='portfolio'),
    url(r'^bookshelf/', include('book.urls')),
)

if settings.DEBUG:
    urlpatterns += patterns(
        '',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
