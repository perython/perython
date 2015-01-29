import $ from 'jquery';
import Radio from 'backbone.radio';
import {Application} from 'backbone.marionette';
import HandlebarsHelper from '../helpers/handlebars-helper';
import LayoutView from './layout-view';

let routerChannel = Radio.channel('router');

export default Application.extend({
  initialize() {
    this.$body = $(document.body);
    this.layout = new LayoutView();
    this.layout.render();

    new HandlebarsHelper().initialize();

    this.listenTo(routerChannel, {
      'before:enter:route': this.onBeforeEnterRoute,
      'enter:route': this.onEnterRoute,
      'error:route': this.onErrorRoute
    });
  },

  onBeforeEnterRoute() {
  },

  onEnterRoute() {
    this.$body.scrollTop(0);
  },

  onErrorRoute() {
  }
});
