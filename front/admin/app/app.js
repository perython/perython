import './plugins';
import $ from 'jquery';
import Backbone from 'backbone';
import {history} from 'backbone';
import Application from './application/application';
import AuthService from './auth/service';
import ModalService from './modal/service';
import SidebarService from './sidebar/service';
import HeaderService from './header/service';
import FlashesService from './flashes/service';
import AuthRouter from './auth/router';
import BooksRouter from './books/router';

let app;

AuthService.identify().then(() => {
  app = new Application();

  AuthService.setup();

  SidebarService.setup({
    container: app.layout.sidebar
  });

  HeaderService.setup({
    container: app.layout.header
  });

  ModalService.setup({
    container: app.layout.overlay
  });

  FlashesService.setup({
    container: app.layout.flashes
  });

  $(document).ajaxError((a, b, c) => {
    let response = b.responseText || '';
    let start = response.indexOf('<p>');
    let end = response.indexOf('</p>');
    let text = 'Server Error';
    if (start > 0 && end > 0) {
      text = response.slice(start + 3, end);
    }
    FlashesService.request('add', {
      type: 'error',
      text: text
    });
  });

  app.books = new BooksRouter({
    container: app.layout.content
  });

}, () => {
  app = new Application(false);

  app.login = new AuthRouter({
    container: app.layout.login
  });

  return () => {
    history.navigate('login', {trigger: true});
  }
}).then((cb) => {
  history.start({root: '/'});
  if (cb) {
    cb();
  }
});
