import {Router} from 'backbone-routing';
import SidebarService from '../sidebar/service';
import IndexRoute from './index/route';

export default Router.extend({
  initialize(options = {}) {
    this.container = options.container;
    this.listenTo(this, 'before:enter', this.onBeforeEnter);

    SidebarService.request('add', {
      name: 'Books',
      path: 'books',
      type: 'primary',
      iconClass: 'fa-book'
    });
  },

  onBeforeEnter() {
    SidebarService.request('activate', {
      path: 'books'
    });
  },

  routes: {
    'books': 'index'
  },

  index() {
    return new IndexRoute({
      container: this.container
    });
  }
});
