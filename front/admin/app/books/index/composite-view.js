import $ from 'jquery';
import Syphon from 'backbone.syphon';
import {CompositeView} from 'backbone.marionette';
import ModalService from '../../modal/service';
import ConfirmModalView from '../../modal/confirm/view';
import BookEditModalView from '../../modal/books/edit/view';
import Model from '../model';
import ItemView from './item-view';
import template from './composite-template.hbs';

export default CompositeView.extend({
  template: template,
  childViewContainer: '.books-list',
  childView: ItemView,

  ui: {
    form: 'form',
    addBtn: '.add',
    totalBooks: '.total-items'
  },

  childEvents: {
    edit: 'edit',
    delete: 'delete'
  },

  events: {
    'click @ui.addBtn': 'add',
    'change @ui.form': 'filtersFormChange',
    'submit @ui.form': 'filtersFormSubmit'
  },

  initialize() {
    this.filters = {};
  },

  templateHelpers() {
    return {
      statuses: this.options.statuses
    }
  },

  onShow() {
    this.scroll();
  },

  filtersFormChange(el) {
    this.filters = Syphon.serialize(el.currentTarget);
    this.sendLoadMore(true);
  },

  filtersFormSubmit(e) {
    e.preventDefault();
  },

  scroll() {
    var offset = 10;
    var scrolling = false;
    var el = this.$el.find('.books-list').get(0);
    $(window).bind('scroll', () => {
      let wOffset = window.scrollY + window.innerHeight - offset;
      if (!scrolling && el.offsetParent.offsetTop + parseInt(el.clientHeight, 10) < wOffset) {
        scrolling = true;
        this.sendLoadMore(false);
        setTimeout(() => {
          scrolling = false;
        }, 1000)
      }
    });
  },

  sendLoadMore(remove) {
    var data = {
      filters: this.filters,
      remove: remove
    };
    this.trigger('loadMore', data);
  },

  updateTotal(total) {
    this.ui.totalBooks.text(total);
  },

  add(e) {
    e.preventDefault();
    let view = new BookEditModalView({
      mode: 'create',
      model: new Model()
    });
    this.listenToOnce(view, 'cancel', () => {
      ModalService.request('close', view);
    });
    this.listenToOnce(view, 'create', (data) => {
      this.collection.add(new Model(data), {at: 0});
    });
    ModalService.request('open', view);
  },

  edit(itemView) {
    let view = new BookEditModalView({
      mode: 'edit',
      model: itemView.model
    });
    this.listenToOnce(view, 'cancel', () => {
      ModalService.request('close', view);
    });
    this.listenToOnce(view, 'edit', (data) => {
      let model = this.collection.get(data.id);
      model.set(data);
    });
    ModalService.request('open', view);
  },

  delete(itemView) {
    let name = `"${itemView.model.get('title')}" by ${itemView.model.get('author')}`;
    let view = new ConfirmModalView({
      title: 'Confirmation',
      text: `Are you sure you want to delete book ${name}?`
    });
    view.listenToOnce(view, 'cancel', () => {
      ModalService.request('close', view);
    });
    view.listenToOnce(view, 'confirm', () => {
      itemView.model.destroy({wait: true}).then(() => {
      });
      ModalService.request('close', view);
    });
    ModalService.request('open', view);
  }
});
