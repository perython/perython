#!/usr/bin/env python
# coding: utf-8
from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from . import STATUS_PLANNING, STATUS_CHOICES


class Book(models.Model):
    author = models.CharField(max_length=200)
    title = models.CharField(max_length=300)
    notes = models.TextField(blank=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_PLANNING)
    img = models.ImageField(upload_to='books/')

    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    date_finished = models.DateField(blank=True, null=True)

    def __unicode__(self):
        return '[Book: "{0}" by {1}, status: {2}]'.format(self.title, self.author, self.get_status_display())

    def get_img_url(self):
        return '{0}{1}'.format(settings.MEDIA_URL, self.img)
