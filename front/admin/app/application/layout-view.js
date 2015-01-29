import $ from 'jquery';
import {LayoutView} from 'backbone.marionette';
import ContentRegion from './content-region';
import template from './layout-template.hbs';

export default LayoutView.extend({
  el: '.application',
  template: template,

  regions: {
    login: '.application__login',
    sidebar: '.application__sidebar',
    header: '.application__header',
    flashes: '.application__flashes',
    content: {
      selector: '.application__content',
      regionClass: ContentRegion
    },
    overlay: '.application__overlay'
  },

  events: {
    'click .navbar-minimalize': 'menuToggler'
  },

  templateHelpers() {
    return {
      isAuthenticated: this.options.isAuthenticated
    }
  },

  onRender() {
    if (this.options.isAuthenticated) {
      $(document.body).removeClass('gray-bg');
    }
  },

  menuToggler(e) {
    e.preventDefault();
    $('body').toggleClass('mini-navbar');
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 100);
    } else if ($('body').hasClass('fixed-sidebar')){
      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 300);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }
});
