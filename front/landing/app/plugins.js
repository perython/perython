import $ from 'jquery';
import Backbone from 'backbone';
Backbone.$ = $;
import Marionette from 'backbone.marionette';
import 'backbone.syphon';
import 'backbone-query-parameters';
import 'babel-polyfill';
import 'sockjs-client';
import config from './config';

// start the marionette inspector
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}

$.ajaxPrefilter((options) => {
  options.url = config.host + options.url;
  return options;
});

$.ajaxSetup ({
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  contentType: 'application/json'
});
