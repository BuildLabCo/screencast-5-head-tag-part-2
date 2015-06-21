import Ember from 'ember';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';

export default Ember.Route.extend( RouteMetaMixin, {
  
  title: function(tokens) {
    let base      = 'AcmeCo',
        hasTokens = tokens && tokens.length;

    return (hasTokens) ? base + " / " + tokens.join(" / ") : base;
  }

});