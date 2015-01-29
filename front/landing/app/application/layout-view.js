import {LayoutView} from 'backbone.marionette';
import template from './layout-template.hbs';
import ContentRegion from './content-region';

export default LayoutView.extend({
  el: '.application',
  template: template,

  regions: {
    content : {
      selector: '.application__content',
      regionClass: ContentRegion
    }
  }
});
