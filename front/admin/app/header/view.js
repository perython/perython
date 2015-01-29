import {ItemView} from 'backbone.marionette';
import AuthService from '../auth/service';
import template from './template.hbs';

export default ItemView.extend({
  template: template,
  tagName: 'div',
  className: 'row border-bottom',

  ui: {
    logout: '.logout'
  },

  events: {
    'click @ui.logout': 'logout'
  },

  logout(e) {
    e.preventDefault();
    AuthService.request('logout');
  }
});
