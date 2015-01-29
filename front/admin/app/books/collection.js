import _ from 'lodash';
import {Collection} from 'backbone';
import Model from './model';

export default Collection.extend({
  url: '/api/books',
  model: Model,

  initialize() {
    this.page = 1;
  },

  parse(response) {
    this.page = response.page;
    this.trigger('total:update', response.total);
    return response.books;
  },

  loadMore(data) {
    var remove = false;
    if (data.remove) {
      this.page = 1;
      remove = data.remove;
    }

    if (!this.page && !remove) return;

    var d = _.assign({
      page: this.page
    }, data.filters);

    var options = {data: d};
    if (remove) {
      options.reset = true;
    } else {
      options.remove = false;
    }

    this.fetch(options)
  }
});
