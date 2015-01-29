# coding: utf-8

# Stdlib imports

# Core Flask imports

# Third-party app imports

# Imports from your apps


class PaginationMixin(object):
    @staticmethod
    def paginate(request, query, per_page=20):
        page = int(request.args.get('page', 1))
        start = (page - 1) * per_page
        end = page * per_page
        total = query.count()

        if page * per_page < total:
            page += 1
        else:
            page = None

        return start, end, page, total
