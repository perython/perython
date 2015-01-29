import $ from 'jquery';
import {ItemView} from 'backbone.marionette';
import FormBehavior from '../../../behaviors/forms-behavior';
import Select2Behavior from '../../../behaviors/select2-behavior';
import FlashesService from '../../../flashes/service';
import template from './template.hbs';

export default ItemView.extend({
  template: template,
  className: 'book-edit-modal',

  ui: {
    form: 'form',
    statusSelect: '[name=status]',
    finishedAtInput: '[name=finished_at]',
    coverFile: 'input[name=cover_file]'
  },

  behaviors: {
    form: { behaviorClass: FormBehavior },
    select2: {
      behaviorClass: Select2Behavior,
      selectList: [{
        name: 'categories_ids',
        el: '[name=categories_ids]',
        options: {
          url: '/api/books/categories/live-search',
          allowClear: true,
          multiple: true,
          data: (term, page) => {
            return {
              q: term,
              page: page,
              page_limit: 20
            }
          },
          initSelectionUrl: '/api/books/categories/live-search'
        }
      }]
    }
  },

  triggers: {
    'click .btn-default': 'cancel',
    'click .close': 'cancel'
  },

  events: {
    'submit form': 'submit',
    'click .btn-primary': 'submitForm',
    'change @ui.statusSelect': 'changeStatus'
  },

  templateHelpers() {
    let titlePrefix = this.options.mode == 'create' ? 'Create' : 'Edit';
    return {
      title: `${titlePrefix} book`,
      errors: this.model.validationError
    };
  },

  changeStatus() {
    let status = this.ui.statusSelect.val();
    if (status === '3') {
      this.ui.finishedAtInput.parent().removeClass('hide');
    } else {
      this.ui.finishedAtInput.parent().addClass('hide');
      this.model.set('finished_at', '');
    }
  },

  submitForm(e) {
    this.ui.form.submit();
  },

  submit(e) {
    e.preventDefault();
    let errors = this.model.validate(this.form);
    if (errors) {
      this.model.validationError = errors;
      this.render();
    } else {
      let formData = new FormData();
      formData.append('cover_file', this.ui.coverFile[0].files[0]);
      let formSerialized = this.ui.form.serializeArray();
      for (var i = 0, length = formSerialized.length; i < length; i++) {
        formData.append(formSerialized[i].name, formSerialized[i].value);
      }
      this.form.cover_file = '';
      this.model.set(this.form);
      let url = '/api/books';
      if (this.options.mode == 'edit') {
        url += `/${this.model.get('id')}`;
      }
      $.ajax({
        url: url,
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: this.options.mode == 'create' ? 'post' : 'put',
        success: (response) => {
          if (response.errors) {
            this.model.validationError = response.errors;
            this.model.unset('errors');
            this.render();
          } else {
            this.trigger(this.options.mode, response);
            this.trigger('cancel');
            FlashesService.request('add', {
              type: 'success',
              text: 'Book saved'
            });
          }
        }
      });
    }
  }
});
