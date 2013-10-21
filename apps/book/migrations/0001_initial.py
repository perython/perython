# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Book'
        db.create_table(u'book_book', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('author', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=300)),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('status', self.gf('django.db.models.fields.CharField')(default='RN', max_length=2)),
            ('img', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('mark', self.gf('django.db.models.fields.IntegerField')()),
            ('date_read', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('date_created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('date_modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'book', ['Book'])


    def backwards(self, orm):
        # Deleting model 'Book'
        db.delete_table(u'book_book')


    models = {
        u'book.book': {
            'Meta': {'object_name': 'Book'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'date_created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'date_read': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'img': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'mark': ('django.db.models.fields.IntegerField', [], {}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'RN'", 'max_length': '2'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '300'})
        }
    }

    complete_apps = ['book']