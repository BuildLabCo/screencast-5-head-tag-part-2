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
        { metaElements, metaSelectors }  = this,
        handlerMeta       = currentLeaf.handler.meta;

    if (handlerMeta) {
      let meta = (typeof handlerMeta === 'object') ? handlerMeta : handlerMeta.apply(currentLeaf.handler);

      _.each(meta, function(metaData, metaType) {
        _.each(metaData, function(val, key) {
          metaSelectors.push(
            'meta['+metaType+'="'+key+'"]'
          );
          metaElements.push(
            $("<meta>").attr(metaType, key).attr("content", val)
          );
        });
      });

      Ember.$('head').append(metaElements);
    }
  },

  actions: {
    didTransition: function() {
      this._super.apply(this, arguments);
      Ember.run.next(this, this.setMeta);
    },

    willTransition: function() {
      this._super.apply(this, arguments);
      Ember.run.next(this, this.resetMeta);
    },

    // This is causing duplicates
    // should fix
    reloadMeta: function() {
      console.log("Reloading!");
      Ember.run.once(this, this.resetMeta);
      Ember.run.next(this, this.setMeta);
    }
  }
});