# coding: utf-8

# Stdlib imports
import csv

# Core Flask imports

# Third-party app imports
from flask.ext.script import Command
from dateutil import parser

# Imports from your apps
from init.database import db
from .models import Book


class UploadBooks(Command):
    def run(self):
        with open('books.csv') as csvfile:
            reader = csv.reader(csvfile, delimiter=',', quotechar='"')
            counter = 0
            for row in reader:
                if row[8] == 'id':
                    continue
                created_at = parser.parse(row[9]) if row[9] else None
                finished_at = parser.parse(row[5]) if row[5] else None
                book = Book(
                    author=row[0],
                    title=row[1],
                    notes=row[2],
                    cover_url=row[3],
                    status=row[4],
                    finished_at=finished_at,
                    user_id=1,
                    created_at=created_at
                )
                db.session.add(book)
                db.session.commit()
                counter += 1
                print(u'added {}'.format(book.title))
            print('{} added'.format(counter))
