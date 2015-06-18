import Ember from 'ember';

export default Ember.Route.extend({
  
  title: function(tokens) {
    let base      = 'AcmeCo',
        hasTokens = tokens && tokens.length;

    return (hasTokens) ? base + " / " + tokens.join(" / ") : base;
  },

  // so let's refactor a container for our dom elements
  metaElements: [],

  // let's add a cache for our selectors
  // to make removing them later easier
  metaSelectors: [],

  // a method that will remove the metaSelectors
  // from the list
  resetMeta: function() {
    let { metaSelectors } = this;
    Ember.$('head').find(metaSelectors.join(',')).remove();

    // reset the metaSelectors array
    // reset the metaElements array
    this.setProperties({
      metaSelectors: [],
      metaElements:  []
    });
  },

  actions: {
    didTransition: function() {

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

    willTransition: function() {
      this.resetMeta();
    }
  }
});