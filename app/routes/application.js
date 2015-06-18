import Ember from 'ember';

export default Ember.Route.extend({
  
  title: function(tokens) {
    let base      = 'AcmeCo',
        hasTokens = tokens && tokens.length;

    return (hasTokens) ? base + " / " + tokens.join(" / ") : base;
  },

  actions: {
    didTransition: function() {
      // We'll assume that only the current route's meta should be applied
      let handlers    = this.router.get('router.currentHandlerInfos'),
          currentLeaf = handlers[handlers.length - 1],
          elements    = [];

      // So at this point our meta is being added
      // but when we click in to the person route, we can see that
      // our meta is not being cleaned up. So let's clean up
      if (currentLeaf.handler.meta) {
        _.each(currentLeaf.handler.meta, function(val, key) {
          Ember.$('head').append($("<meta>").attr(key, val));
        });
      }

    }
  }
});