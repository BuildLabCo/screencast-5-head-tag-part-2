import Ember from 'ember';

export default Ember.Route.extend({
  
  // Facebook uses the property key
  // but other things like twitter use the name key

  meta: {
    property: {
      "og:name":  "AcmeCo: People",
      "og:image": "//www.acmeco.com/logo.png"
    },
    name: {
      "twitter:title": "AcmeCo: People",
      "twitter:image": "//www.acmeco.com/logo.png"
    }
  },
});