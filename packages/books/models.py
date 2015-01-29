# coding: utf-8

# Stdlib imports

# Core Flask imports

# Third-party app imports

# Imports from your apps
from init.database import db, TimestampMixin, BaseModel


class Book(BaseModel, TimestampMixin, db.Model):
    __tablename__ = 'books'

    STATUS_PLANNING = 1
    STATUS_IN_PROGRESS = 2
    STATUS_FINISHED = 3

    author = db.Column(db.String(512), nullable=False)
    title = db.Column(db.String(512), nullable=False)
    notes = db.Column(db.Text)
    cover_url = db.Column(db.String(512), default='')

    status = db.Column(db.Integer, default=STATUS_PLANNING)
    finished_at = db.Column(db.DateTime, nullable=True)

    categories = db.relationship(
        'Category', secondary='books_categories_connections', backref=db.backref('books', lazy='dynamic')
    )

    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'), nullable=False)
    user = db.relationship(
        'User', backref=db.backref('books', lazy='dynamic')
    )
    is_delete = db.Column(db.Boolean, nullable=False, default=False)


class Category(BaseModel, TimestampMixin, db.Model):
    __tablename__ = 'books_categories'

    name = db.Column(db.String(128), nullable=False, unique=True)

    is_delete = db.Column(db.Boolean, nullable=False, default=False)


class BooksCategoriesConnections(db.Model):
    __tablename__ = 'books_categories_connections'

    id = db.Column(db.Integer(), primary_key=True)
    book_id = db.Column(db.Integer(), db.ForeignKey('books.id'))
    category_id = db.Column(db.Integer(), db.ForeignKey('books_categories.id'))
