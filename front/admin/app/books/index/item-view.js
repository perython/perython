import {ItemView} from 'backbone.marionette';
import template from './item-template.hbs';

export default ItemView.extend({
  template: template,
  tagName: 'div',
  className: 'col-sm-6 col-md-3',

  triggers: {
    'click .edit': 'edit',
    'click .delete': 'delete'
  },

  modelEvents: {
    sync: 'render'
  }
});
