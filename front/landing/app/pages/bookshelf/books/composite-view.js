import {CompositeView} from 'backbone.marionette';
import ItemView from './item-view';
import template from './composite-template.hbs';

export default CompositeView.extend({
  template: template,
  className: 'books__wrap',
  childViewContainer: '.books__list',
  childView: ItemView,

  ui: {
    totalItems: '.total-items'
  },

  initialize() {
    this.listenTo(this.collection, 'collection:total', () => {
      this.updateTotal();
    });
  },

  templateHelpers() {
    return {
      total: this.collection.total
    }
  },

  onShow() {
    this.updateTotal()
  },

  updateTotal() {
    this.ui.totalItems.text(this.collection.total);
  }
});
