import {Router} from 'backbone-routing';
import IndexRoute from './index/route';
import BookshelfRoute from './bookshelf/route';

export default Router.extend({
  initialize(options) {
    this.container = options.container;
  },

  routes: {
    '': 'index',
    'bookshelf': 'bookshelf'
  },

  index() {
    return new IndexRoute({
      container: this.container
    });
  },

  bookshelf() {
    return new BookshelfRoute({
      container: this.container
    });
  }
});
