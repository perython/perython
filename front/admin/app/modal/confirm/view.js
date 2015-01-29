import {Model} from 'backbone';
import {ItemView} from 'backbone.marionette';
import template from './template.hbs';

export default ItemView.extend({
  template: template,

  initialize(options = {}) {
    this.model = new Model(options);
  },

  triggers: {
    'click .btn-primary': 'confirm',
    'click .btn-default': 'cancel',
    'click .close': 'cancel'
  }
});
