# coding: utf-8

# Stdlib imports

# Core Flask imports

# Third-party app imports
from marshmallow import Schema, fields

# Imports from your apps


__all__ = (
    'BookSchema',
    'BookPublicListSchema',
    'BookPublicSchema',
    'BookListSchema',
    'BookFilterSchema',
    'BookEditSchema',
    'CategoriesPublicListSchema',
    'CategoriesLiveSearchSchema',
)


class BookSchema(Schema):
    id = fields.Int(dump_only=True)
    author = fields.Str()
    title = fields.Str()
    categories_ids = fields.Method('get_categories_ids')
    categories_names = fields.Method('get_categories_names')
    notes = fields.Str()
    cover_url = fields.Str()
    status = fields.Int()
    finished_at = fields.Method('get_finished_at')
    created_at = fields.DateTime(format='iso')

    def get_categories_ids(self, obj):
        return ','.join([str(c.id) for c in obj.categories])

    def get_categories_names(self, obj):
        return [c.name for c in obj.categories]

    def get_finished_at(self, obj):
        if obj:
            return obj.finished_at.strftime('%Y-%m-%d')
        else:
            return None


class BookPublicSchema(Schema):
    id = fields.Int(dump_only=True)
    author = fields.Str()
    title = fields.Str()
    cover_url = fields.Str()


class BookPublicListSchema(Schema):
    page = fields.Int(allow_none=True)
    total = fields.Int()
    books = fields.Nested(BookPublicSchema, many=True)


class BookListSchema(Schema):
    page = fields.Int(allow_none=True)
    total = fields.Int()
    books = fields.Nested(BookSchema, many=True)


class BookFilterSchema(Schema):
    status = fields.Int()
    query = fields.Str()


class BookEditSchema(Schema):
    author = fields.Str(required=True)
    title = fields.Str(required=True)
    status = fields.Int(required=True)
    notes = fields.Str()
    finished_at = fields.Str()


class CategoriesPublicListSchema(Schema):
    id = fields.Str()
    name = fields.Str()


class CategoriesLiveSearchSchema(Schema):
    id = fields.Str()
    text = fields.Str(attribute='name')
