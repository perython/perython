#!/usr/bin/env python
# coding: utf-8

from django.db import models
from tagging.fields import TagField
from tagging.models import Tag

class Post(models.Model):
    title = models.CharField(max_length=100)
    entry = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    tags = TagField(blank=True, null=True)
    visible = models.BooleanField()
    
    def __unicode__(self):
        return 'fuck'
        return '%s' % (self.title,)

    def get_tags(self):
        return Tag.objects.get_for_object(self)

    def get_absolute_url(self):
        return '/notes/%i/' % (self.id)
