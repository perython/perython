import {Route} from 'backbone-routing';
import LayoutView from './layout-view';

export default Route.extend({
  initialize(options) {
    this.container = options.container;
  },

  render() {
    this.layoutView = new LayoutView();
    this.container.show(this.layoutView);
  }
});
