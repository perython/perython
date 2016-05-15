# coding: utf-8

# Stdlib imports
import json
import os

# Core Flask imports
from flask import abort
from flask import Blueprint
from flask import request
from flask.views import MethodView

# Third-party app imports
from dateutil import parser
from sqlalchemy import or_
from flask.ext.login import login_required, current_user
from werkzeug.utils import secure_filename

# Imports from your apps
from init.flask_init import app
from init.database import db
from .models import Book, Category
from .mixins import PaginationMixin
from .schemas import *


books = Blueprint('books', __name__, url_prefix='/api/books')


class BooksPublicListView(MethodView, PaginationMixin):
    def get(self):
        books_query = Book.query.filter(
            Book.is_delete == False
        ).order_by(Book.created_at.desc())

        category_id = request.args.get('category_id')
        if category_id:
            books_query = books_query.filter(
                Book.categories.any(Category.id == category_id)
            )

        start, end, page, total = self.paginate(request, books_query)

        data = BookPublicListSchema().dump({
            'page': page,
            'total': total,
            'books': books_query.slice(start, end)
        }).data
        return json.dumps(data)


class BooksListView(MethodView, PaginationMixin):
    @login_required
    def get(self):
        books_query = self._filter_books(request.args)

        start, end, page, total = self.paginate(request, books_query)

        data = BookListSchema().dump({
            'page': page,
            'total': total,
            'books': books_query.slice(start, end)
        }).data
        return json.dumps(data)

    @staticmethod
    def _filter_books(args):
        filters = BookFilterSchema().load(args).data
        books_query = current_user.books.filter(
            Book.is_delete == False
        )

        if filters.get('status'):
            books_query = books_query.filter(
                Book.status == filters['status']
            )

        if filters.get('query'):
            query = u'%{}%'.format(filters['query'])
            books_query = books_query.filter(
                or_(
                    Book.author.ilike(query),
                    Book.title.ilike(query)
                )
            )

        books_query = books_query.order_by(Book.created_at.desc())
        return books_query

    @login_required
    def post(self):
        data, errors = BookEditSchema().load(request.values)
        if errors:
            return json.dumps({'errors': errors})

        book = Book(
            author=data['author'],
            title=data['title'],
            status=data['status'],
            notes=data.get('notes', ''),
            user_id=current_user.id
        )

        cover_file = request.files.get('cover_file')
        if cover_file:
            filename = secure_filename(cover_file.filename)
            directory = app.config['BOOKS_MEDIA_FOLDER']
            if not os.path.exists(directory):
                os.makedirs(directory)
            file_path = os.path.join(directory, filename)
            cover_file.save(file_path)
            book.cover_url = u'books/{}'.format(filename)

        categories_ids = request.values.get('categories_ids', '').split(',')
        for category_id in categories_ids:
            category = Category.query.get(category_id)
            book.categories.append(category)

        db.session.add(book)
        db.session.commit()

        data = BookSchema().dump(book).data
        return json.dumps(data)


class BooksDetailView(MethodView):
    @login_required
    def get(self, book_id):
        book = Book.query.filter(
            Book.is_delete == False,
            Book.id == book_id
        ).first()

        if not book:
            abort(404)

        data = BookSchema().dump(book).data
        return json.dumps(data)

    @login_required
    def put(self, book_id):
        book = Book.query.filter(
            Book.is_delete == False,
            Book.id == book_id
        ).first()

        if not book or book.user_id != current_user.id:
            abort(404)

        data, errors = BookEditSchema().load(request.values)
        if errors:
            return json.dumps({'errors': errors})

        book.author = data['author']
        book.title = data['title']
        book.status = data['status']
        book.notes = data.get('notes', '')

        if book.status == book.STATUS_FINISHED:
            finished_at = data.get('finished_at')
            if finished_at:
                book.finished_at = parser.parse(finished_at)
            else:
                book.finished_at = None

        cover_file = request.files.get('cover_file', '')
        if cover_file:
            filename = secure_filename(cover_file.filename)
            directory = app.config['BOOKS_MEDIA_FOLDER']
            if not os.path.exists(directory):
                os.makedirs(directory)
            file_path = os.path.join(directory, filename)
            cover_file.save(file_path)
            book.cover_url = u'books/{}'.format(filename)

        book.categories = []
        categories_ids = request.values.get('categories_ids', '').split(',')
        for category_id in categories_ids:
            category = Category.query.get(category_id)
            book.categories.append(category)

        db.session.add(book)
        db.session.commit()

        return json.dumps(BookSchema().dump(book).data)

    @login_required
    def delete(self, book_id):
        book = Book.query.filter(
            Book.is_delete == False,
            Book.id == book_id
        ).first()

        if not book or book.user_id != current_user.id:
            abort(404)

        book.is_delete = True
        db.session.add(book)
        db.session.commit()

        return json.dumps({'success': True})


class CategoriesPublicListView(MethodView):
    def get(self):
        categories_query = Category.query.filter(
            Category.is_delete == False
        ).order_by(Category.name)

        data = CategoriesPublicListSchema().dump(categories_query, many=True).data
        return json.dumps(data)


class CategoriesLiveSearchView(MethodView, PaginationMixin):
    @login_required
    def get(self):
        categories_query = Category.query.filter(
            Category.is_delete == False
        ).order_by(Category.name)

        ids = request.args.get('ids')
        if ids:
            ids = ids.split(',')
            categories_query = categories_query.filter(
                Category.id.in_(ids)
            )
            data = CategoriesLiveSearchSchema().dump(categories_query, many=True).data
            return json.dumps(data)

        q = request.args.get('q')
        if q:
            categories_query = categories_query.filter(
                Category.name.ilike('%{}%'.format(q.strip()))
            )

        start, end, page, total = self.paginate(request, categories_query)

        data = CategoriesLiveSearchSchema().dump(categories_query.slice(start, end), many=True).data
        return json.dumps({
            'more': bool(page),
            'results': data
        })


books.add_url_rule('', view_func=BooksListView.as_view('list'))
books.add_url_rule('/public', view_func=BooksPublicListView.as_view('public_list'))
books.add_url_rule('/<int:book_id>', view_func=BooksDetailView.as_view('detail'))
books.add_url_rule('/categories/public', view_func=CategoriesPublicListView.as_view('categories_public_list'))
books.add_url_rule('/categories/live-search', view_func=CategoriesLiveSearchView.as_view('categories_live_search'))
