import Ember from 'ember';

export default Ember.Route.extend({
  
  titleToken: "People",
  
  model: function() {
    return $.getJSON('/people.json').then((res) => {
      this.store.pushPayload('person', res);
      return this.store.all('person');
    });
  }

});