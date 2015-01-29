import {ItemView} from 'backbone.marionette';
import template from './item-template.hbs';

export default ItemView.extend({
  tagName: 'button',
  className: 'btn filter-item',
  template: template,

  attributes: {
    type: 'button'
  },

  triggers: {
    click: 'set'
  }
});
