import {Collection} from 'backbone';
import Service from 'backbone.service';
import AuthService from '../auth/service';
import View from './view';

const SidebarService = Service.extend({
  setup(options = {}) {
    this.container = options.container;
  },

  start() {
    this.collection = new Collection();
    AuthService.request('user').then(user => {
      this.view = new View({
        collection: this.collection,
        user: user
      });
      this.container.show(this.view);
    });
  },

  requests: {
    add: 'add',
    remove: 'remove',
    activate: 'activate'
  },

  add(model) {
    this.collection.add(model);
  },

  remove(model) {
    model = this.collection.findWhere(model);
    this.collection.remove(model);
  },

  activate(model) {
    this.collection.invoke('set', 'active', false);
    model = this.collection.findWhere(model);
    if (model) {
      model.set('active', true);
    }
  }
});

export default new SidebarService();
