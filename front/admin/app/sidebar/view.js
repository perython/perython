import _ from 'lodash';
import {history} from 'backbone';
import {ItemView} from 'backbone.marionette';
import AuthService from '../auth/service';
import template from './template.hbs';

export default ItemView.extend({
  template: template,
  tagName: 'nav',
  className: 'navbar-default navbar-static-side',

  attributes: {
    role: 'navigation'
  },

  collectionEvents: {
    all: 'render'
  },

  ui: {
    collapse: '#navbar-collapse',
    logout: '.logout'
  },

  events: {
    'show.bs.collapse #navbar-collapse': 'onCollapseShow',
    'click @ui.logout': 'logout'
  },

  templateHelpers() {
    return {
      user: this.options.user,
      primaryItems: this.serializeWhere({ type: 'primary' }),
      secondaryItems: this.serializeWhere({ type: 'secondary' })
    };
  },

  serializeWhere(props) {
    return _.invoke(this.collection.where(props), 'toJSON');
  },

  onCollapseShow() {
    this.listenToOnce(history, 'route', function() {
      this.ui.collapse.collapse('hide');
    });
  },

  logout(e) {
    e.preventDefault();
    AuthService.request('logout');
  }
});
