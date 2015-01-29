import {ItemView} from 'backbone.marionette';
import template from './item-template.hbs';

export default ItemView.extend({
  tagName: 'li',
  template: template,

  ui: {
    bookLink: '.book-link'
  },

  events: {
    'click @ui.bookLink': 'clickBook'
  },

  clickBook(e) {
    e.preventDefault();
    let name = `"${this.model.get('title')}" by ${this.model.get('author')}`;
    console.log(`You clicked on ${name}`);
  }
});
