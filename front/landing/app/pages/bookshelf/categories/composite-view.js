import $ from 'jquery';
import {CompositeView} from 'backbone.marionette';
import ItemView from './item-view';
import template from './composite-template.hbs';

export default CompositeView.extend({
  template: template,
  className: 'books-filters',
  childViewContainer: '.categories-list',
  childView: ItemView,

  childEvents: {
    set: 'set'
  },

  collectionEvents: {
    sync: 'setWidth'
  },

  setWidth() {
    let btnsWidths = this.$el.find('button').map((i, btn) => {
      return btn.clientWidth + 10;
    });
    let sum = $.makeArray(btnsWidths).reduce((a, b) => {return a + b;});
    this.$el.width(sum + 5);
  },

  set(itemView) {
    if (itemView.$el.hasClass('filter-item-active')) {
      this.trigger('categories:unset');
      itemView.$el.removeClass('filter-item-active');
    } else {
      this.trigger('categories:set', itemView.model.get('id'));
      this.$el.find('.filter-item').removeClass('filter-item-active');
      itemView.$el.addClass('filter-item-active');
    }
  }
});
