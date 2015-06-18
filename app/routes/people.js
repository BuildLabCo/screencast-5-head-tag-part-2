import Ember from 'ember';

export default Ember.Route.extend({
  
  titleToken: "People",

  model: function() {
    return $.getJSON('/people.json').then((res) => {
      this.store.pushPayload('person', res);
      return this.store.all('person');
    });
  },

  actions: {
    didTransition: function() {
      $('meta[property="og:name"]').attr('content', 'Acme Co: People');
    }
  }

});