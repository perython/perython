# coding: utf-8
import os

PROJECT_ROOT = os.path.join(os.path.normpath(os.path.dirname(__file__)), '..')

DEBUG = True
SECRET_KEY = 'JK&^*(&S8d97s89sad6s7S)8'
SQLALCHEMY_DATABASE_URI = 'postgresql://perython:11235@localhost/perython'

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

BOOKS_MEDIA_FOLDER = os.path.join(PROJECT_ROOT, 'media/books')

SPOTIFY_CLIENT_ID = 'c7179922788149fc96bb48bd114a09ea'
SPOTIFY_CLIENT_SECRET = 'f48976c6b91644fbbae07c2d871cddaa'
SPOTIFY_AUTH_REDIRECT_URI = 'http://localhost:5000/api/spotify/auth/callback'

TORNADO_PORT = 8081
TORNADO_HOST = '192.168.10.219'
