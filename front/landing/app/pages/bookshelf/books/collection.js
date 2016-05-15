import {Collection} from 'backbone';

export default Collection.extend({
  url: '/api/books/public',

  initialize() {
    this.page = 1;
  },

  parse(response) {
    this.total = response.total;
    this.trigger('collection:total');
    this.page = response.page;
    return response.books;
  },

  loadMore(options) {
    if (!this.page && !options.remove) { return; }

    if (options.remove) {
      this.page = 1;
    }
    let data = Object.assign({}, options.data || {}, {page: this.page});
    this.fetch({
      data: data,
      remove: !!options.remove
    })
  }
});
