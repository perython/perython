import {Route} from 'backbone-routing';
import Collection from '../collection';
import CompositeView from './composite-view';

export default Route.extend({
  initialize(options) {
    this.container = options.container;
  },

  render() {
    var collection = new Collection();
    collection.loadMore({});

    this.compositeView = new CompositeView({
      collection: collection
    });

    this.container.show(this.compositeView);

    this.listenTo(collection, 'total:update', function(total) {
      this.compositeView.updateTotal(total);
    });

    this.listenTo(this.compositeView, 'loadMore', function (data) {
      collection.loadMore(data);
    });
  }
});
