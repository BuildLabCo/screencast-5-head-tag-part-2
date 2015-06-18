import Ember from 'ember';

export default Ember.Route.extend({

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
  },

  actions: {
    // so now we can see that when we navigate to the user route
    // the properties are updated
    // but when we go back to the people route, because we aren't updating
    // the image meta tag in the people route, the meta for the people route stays
    // as the user's image.

    // this becomes additionally more difficult when we want to add and remove
    // meta tags when on this route.

    // so this obv. isn't the way to go, let's refactor
    didTransition: function() {
      let model = this.get('currentModel');
      $('meta[property="og:name"]').attr('content', 'Acme Co: ' + model.get('name'));
      $('meta[property="og:image"]').attr('content', "//www.acmeco.com/user-1234.png");
    }
  }

});