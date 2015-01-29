import {Model} from 'backbone';

export default Model.extend({
  urlRoot: '/api/books',

  defaults: {
    title: '',
    author: '',
    status: '',
    finished_at: '',
    cover_file: '',
    notes: ''
  },

  validate(attrs) {
    var errors = {};

    if (attrs.author === '') {
      errors.author = 'Author is missing';
    }

    if (attrs.title === '') {
      errors.title = 'Title is missing';
    }

    if (!attrs.id && attrs.cover_file === '') {
      errors.cover_file = 'Cover is missing';
    }

    if (attrs.status === '3' && attrs.finished_at === '') {
      errors.finished_at = 'Finished date is missing';
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  }
});
