import Ember from 'ember';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';
export default Ember.Route.extend(RouteMetaMixin, {

  // So here we need this to be a function
  // so that we can grab the employees name
  // we're also going to add and additional property here to see how that works
  meta: function() {
    return {
      property: {
        "og:name": `AcmeCo: ${this.get('currentModel.name')}`,
        "og:image": this.get('currentModel.image'),
        "og:description": this.get('currentModel.bio')
      },
      name: {
        "twitter:title": `AcmeCo: ${this.get('currentModel.name')}`,
        "twitter:image": this.get('currentModel.image'),
        "twitter:description": this.get('currentModel.bio')
      }
    }
  },

  title: function() {
    return `${this.get('currentModel.name')} is Amazing!`;
  },

  model: function(params) {
    return this.store.getById('person', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    let models        = this.store.all('person'),
        currentIndex  = models.indexOf(model),
        next          = (currentIndex === (models.get('length') - 1)) ? 0 : currentIndex + 1,
        prev          = (currentIndex === 0) ? (models.get('length') - 1) : currentIndex - 1;

    controller.setProperties({
      nextPerson: models.objectAt(next),
      previousPerson: models.objectAt(prev)
    });

  }

});