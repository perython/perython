import $ from 'jquery';
import _ from 'lodash';
import Radio from 'backbone.radio';
import nprogress from 'nprogress';
import {Application} from 'backbone.marionette';
import HandlebarsHelper from '../helpers/handlebars-helper';
import LayoutView from './layout-view';

let routerChannel = Radio.channel('router');

nprogress.configure({
  showSpinner: false
});

export default Application.extend({
  initialize(isAuthenticated=true) {
    this.$body = $(document.body);
    this.layout = new LayoutView({isAuthenticated: isAuthenticated});
    this.layout.render();

    new HandlebarsHelper().initialize();

    this.listenTo(routerChannel, {
      'before:enter:route' : this.onBeforeEnterRoute,
      'enter:route'        : this.onEnterRoute,
      'error:route'        : this.onErrorRoute
    });
  },

  onBeforeEnterRoute() {
    this.transitioning = true;
    // Don't show for synchronous route changes
    _.defer(() => {
      if (this.transitioning) {
        nprogress.start();
      }
    });
  },

  onEnterRoute() {
    this.transitioning = false;
    this.$body.scrollTop(0);
    nprogress.done();
  },

  onErrorRoute() {
    this.transitioning = false;
    nprogress.done(true);
  }
});
