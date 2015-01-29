import $ from 'jquery';
import {Collection} from 'backbone';
import {LayoutView} from 'backbone.marionette';
import BooksCollection from './books/collection';
import BooksCompositeView from './books/composite-view';
import CategoriesCompositeView from './categories/composite-view';
import template from './layout-template.hbs';

export default LayoutView.extend({
  template: template,
  className: 'public',

  regions: {
    categoriesRegion: '.categories-region',
    booksRegion: '.books-region'
  },

  initialize () {
    this.categoryId = null;
  },

  onRender() {
    let categoriesCollection = new Collection();
    categoriesCollection.url = '/api/books/categories/public';
    categoriesCollection.fetch();

    let categoriesCompositeView = new CategoriesCompositeView({
      collection: categoriesCollection
    });
    this.categoriesRegion.show(categoriesCompositeView);

    this.booksCollection = new BooksCollection();
    this.booksCollection.loadMore({});

    let booksCompositeView = new BooksCompositeView({
      collection: this.booksCollection
    });
    this.booksRegion.show(booksCompositeView);

    this.listenTo(this.booksCollection, 'loadMore', (options) => {
      let data = {};
      if (this.categoryId) {
        data.category_id = this.categoryId;
      }
      this.booksCollection.loadMore({
        remove: !!options.remove,
        data: data
      });
    });

    this.listenTo(categoriesCompositeView, 'categories:set', (categoryId) => {
      this.categoryId = categoryId;
      this.booksCollection.trigger('loadMore', {remove: true})
    });

    this.listenTo(categoriesCompositeView, 'categories:unset', () => {
      this.categoryId = null;
      this.booksCollection.trigger('loadMore', {remove: true})
    })
  },

  onShow() {
    this.scroll();
  },

  scroll() {
    var offset = 10;
    var scrolling = false;
    var el = this.$el.find('.books__list').get(0);
    $(window).bind('scroll', () => {
      if (!scrolling && el.offsetParent.offsetTop + parseInt(el.clientHeight, 10) < window.scrollY + window.innerHeight - offset) {
        scrolling = true;
        this.booksCollection.trigger('loadMore', {});
        setTimeout(() => {
          scrolling = false;
        }, 1000)
      }
    });
  }
});
