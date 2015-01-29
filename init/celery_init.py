# -*- coding: utf-8 -*-

# Stdlib imports

# Core Flask imports

# Third-party app imports
from celery import Celery
from celery.signals import task_postrun

# Imports from your apps
from init.flask_init import app
from init.database import db


def make_celery(app):
    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery


@task_postrun.connect
def close_session(*args, **kwargs):
    db.session.remove()


celery = make_celery(app)
