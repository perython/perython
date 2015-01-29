import {CompositeView} from 'backbone.marionette';
import ItemView from './item-view';
import template from './composite-template.hbs';

export default CompositeView.extend({
  template: template,
  className: 'books__wrap',
  childViewContainer: '.books__list',
  childView: ItemView,

  templateHelpers() {
    return {
      total: this.collection.total
    }
  }
});
