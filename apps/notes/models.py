#!/usr/bin/env python
# coding: utf-8

from django.db import models
from taggit.managers import TaggableManager

class Post(models.Model):
    title = models.CharField(max_length=100)
    entry = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    tags = TaggableManager()
    visible = models.BooleanField()
    
    def __unicode__(self):
        return self.title

    def get_tags(self):
        return self.tags.all()

    def get_absolute_url(self):
        return '/notes/%i/' % (self.id)
