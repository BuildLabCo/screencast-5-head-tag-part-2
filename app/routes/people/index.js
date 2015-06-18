import Ember from 'ember';

export default Ember.Route.extend({
  // for the first iteration, we'll just have K/V obj here
  // in a later commit, we'll refactor to break up property/content and name/content
  meta: {
    "og:name":  "AcmeCo: People",
    "og:image": "//www.acmeco.com/logo.png"
  },
});