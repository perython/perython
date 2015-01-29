import _ from 'lodash';
import $ from 'jquery';
import {Behavior} from 'backbone.marionette';

export default Behavior.extend({
  initialize() {
    this.listenTo(this.view, 'select2:destroy', this.destroySelect2);
    this.listenTo(this.view, 'select2:init', this.initSelect2);
    this.listenTo(this.view, 'select2:clear', this.clearSelect2);
  },

  onRender() {
    this.initAllSelect2();
  },

  initAllSelect2() {
    for (let item of this.options.selectList) {
      let $select2 = this.view.$el.find(item.el);
      let url = item.options.url;

      let options = item.options;
      options = {
        multiple: item.options.multiple || false,
        placeholder: $select2.attr('placeholder') || '',
        minimumInputLength: 0,
        allowClear: item.options.allowClear || false
      };
      let addAttrs = item.additionalAttrs;
      if (addAttrs) {
        if (typeof addAttrs === 'string') {
          addAttrs = this.view[addAttrs];
        }
      }
      if (url) {
        options.ajax = {
          url: url,
          dataType: 'json',
          cache: true,
          results: (data) => {
            return {results: data.results, more: data.more};
          }
        };

        if (item.options.data) {
          options.ajax.data = item.options.data;
        } else {
          options.ajax.data = (term, page) => {
            let result = {page: page, page_limit: 100};
            if (item.searchParam) {
              result[item.searchParam] = term;
            } else {
              result.q = term;
            }
            if (addAttrs) {
              let attrs;
              attrs = addAttrs;
              if (typeof attrs === 'function') {
                attrs = addAttrs.apply(this.view, [$select2, item]);
              }
              _.assign(result, attrs);
            }
            return result;
          }
        }

        options.initSelection = function(el, cb) {
          if (el.val()) {
            let url = item.options.initSelectionUrl;
            url += `?ids=${el.val()}`;
            $.getJSON(url).done((data) => {
              cb(data);
            });
          }
        };

      }
      options.url = url;
      this[item.name] = item;
      this[item.name].options = options;
      this.view[item.name] = $select2.select2(options);
      let disabled = item.disabled;
      if (typeof item.disabled === 'function') {
        disabled = item.disabled.apply(this.view);
      }
      if (disabled) {
        this.view[item.name].select2('disable');
      }
    }
  },

  destroySelect2(data) {
    for (let item of data) {
      this.view[item].select2('destroy').val('');
    }
  },

  initSelect2(data) {
    for (let item of data) {
      this.view[item].select2(this[item].options);
      if (this[item].disabled) {
        this.view[item].select2('disable');
      }
    }
  },

  clearSelect2(data) {
    for (let item of data) {
      this.view[item].select2('val', '');
    }
  }
});
