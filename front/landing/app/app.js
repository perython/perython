import './plugins';
import $ from 'jquery';
import Backbone from 'backbone';
import Application from './application/application';
import SocketService from './socket/service';
import PagesRouter from './pages/router';

let app = new Application();

SocketService.setup();

app.pages = new PagesRouter({
  container: app.layout.content
});

Backbone.history.start({root: '/'});
