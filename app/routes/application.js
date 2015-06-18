import Ember from 'ember';

export default Ember.Route.extend({
  
  title: function(tokens) {
    let base      = 'AcmeCo',
        hasTokens = tokens && tokens.length;

    return (hasTokens) ? base + " / " + tokens.join(" / ") : base;
  },

  // so let's refactor a container for our dom elements
  metaElements: [],

  actions: {
    didTransition: function() {

      let handlers    = this.router.get('router.currentHandlerInfos'),
          currentLeaf = handlers[handlers.length - 1],

          // ref it locally
          { metaElements } = this;

      if (currentLeaf.handler.meta) {

        // loop through each item in the meta obj and push
        // to the metaElements
        _.each(currentLeaf.handler.meta, function(val, key) {
          metaElements.push($("<meta>").attr(key, val))
        });

        // And then finally append to the head
        // we can now see our refactor is working as expected
        Ember.$('head').append(metaElements);
      }

    }
  }
});