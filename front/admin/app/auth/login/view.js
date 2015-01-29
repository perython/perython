import $ from 'jquery';
import Syphon from 'backbone.syphon';
import {ItemView} from 'backbone.marionette';
import AuthService from '../service';
import template from './template.hbs';

export default ItemView.extend({
  className: 'middle-box text-center loginscreen',
  template: template,

  ui: {
    email: '[name=email]',
    password: '[name=password]',
    errorMessage: '#password-error'
  },

  events: {
    'submit form': 'submit'
  },

  submit(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/auth/login',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(Syphon.serialize(this)),
      success: (response) => {
        AuthService.request('login', response.token);
      },
      statusCode: {
        400: () => {
          this.ui.email.closest('.form-group').addClass('has-error');
          this.ui.password.closest('.form-group').addClass('has-error');
          this.ui.errorMessage.removeClass('hide');
          this.ui.email.select().focus();
        }
      }
    })
  }
});
