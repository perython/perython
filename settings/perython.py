# coding: utf-8
import os

PROJECT_ROOT = os.path.join(os.path.normpath(os.path.dirname(__file__)), '..')

DEBUG = True
SECRET_KEY = 'JK&^*(&S8d97s89sad6s7S)8'
SQLALCHEMY_DATABASE_URI = 'postgresql://perython:11235@localhost/perython'

BOOKS_MEDIA_FOLDER = os.path.join(PROJECT_ROOT, 'media/books')
