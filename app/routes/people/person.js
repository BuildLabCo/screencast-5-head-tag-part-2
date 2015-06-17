import Ember from 'ember';

export default Ember.Route.extend({

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