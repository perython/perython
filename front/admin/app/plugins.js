import Backbone from 'backbone';
import $ from 'jquery';
Backbone.$ = $;
import Marionette from 'backbone.marionette';
import 'bootstrap';
import 'backbone.syphon';
import 'backbone-query-parameters';
import 'babel-polyfill';
import 'select2';
import config from './config';

if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}

$.ajaxPrefilter((options) => {
  options.url = config.host + options.url;
  if (window.localStorage.token) {
    options.headers['Authentication'] = window.localStorage.token;
  }
  return options;
});

$.ajaxSetup ({
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  contentType: 'application/json'
});
