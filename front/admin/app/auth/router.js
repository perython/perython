import {Router} from 'backbone-routing';
import LoginRoute from './login/route';

export default Router.extend({
  initialize(options) {
    this.container = options.container;
  },

  routes: {
    'login': 'login'
  },

  login() {
    return new LoginRoute({
      container: this.container
    });
  }
});
