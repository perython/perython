import Service from 'backbone.service';
import config from '../config';
import Model from './model';

const AuthService = Service.extend({
  setup(options = {}) {},

  requests: {
    login: 'login',
    logout: 'logout',
    user: 'user'
  },

  identify() {
    this.model = new Model();
    return new Promise((resolve, reject) => {
      if (window.localStorage.token) {
        this.model.fetch({
          success: (model) => {
            resolve(this);
          },
          error: () => {
            reject(this);
          }
        });
      } else {
        reject(this);
      }
    });
  },

  login(token) {
    window.localStorage.setItem('token', token);
    window.location.href = config.adminPage;
  },

  logout() {
    window.localStorage.removeItem('token');
    window.location.href = config.adminPage;
  },

  user() {
    return JSON.parse(window.localStorage.getItem('user'));
  }
});

export default new AuthService();
