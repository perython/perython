import Service from 'backbone.service';
import View from './view';

const HeaderService = Service.extend({
  setup(options = {}) {
    this.container = options.container;
    this.start();
  },

  start() {
    this.view = new View();
    this.container.show(this.view);
  }
});

export default new HeaderService();
