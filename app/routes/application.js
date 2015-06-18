import Ember from 'ember';

export default Ember.Route.extend({
  
  title: function(tokens) {
    let base      = 'AcmeCo',
        hasTokens = tokens && tokens.length;

    return (hasTokens) ? base + " / " + tokens.join(" / ") : base;
  },

  // so let's refactor a container for our dom elements
  metaElements: [],

  metaSelectors: [],

  resetMeta: function() {
    let { metaSelectors } = this;
    Ember.$('head').find(metaSelectors.join(',')).remove();

    this.setProperties({
      metaSelectors: [],
      metaElements:  []
    });
  },

  // moving this out of the didTransition and into its own method
  setMeta: function() {
    let handlers          = this.router.get('router.currentHandlerInfos'),
        currentLeaf       = handlers[handlers.length - 1],
        { metaElements, metaSelectors }  = this;

    if (currentLeaf.handler.meta) {

      _.each(currentLeaf.handler.meta, function(val, key) {
        metaSelectors.push(
          'meta[property="'+key+'"]'
        );
        metaElements.push(
          $("<meta>").attr("property", key).attr("content", val)
        );
      });

      Ember.$('head').append(metaElements);
    }
  },

  actions: {
    didTransition: function() {

      // Should explain why we should wrap this
      // in the run loop
      Ember.run.next(this, this.setMeta);
    },

    willTransition: function() {
      Ember.run.next(this, this.resetMeta);
    }
  }
});