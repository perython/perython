import './plugins';
import $ from 'jquery';
import Backbone from 'backbone';
import Application from './application/application';
import PagesRouter from './pages/router';

let app = new Application();

app.pages = new PagesRouter({
  container: app.layout.content
});

Backbone.history.start({root: '/'});
