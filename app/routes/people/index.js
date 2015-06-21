import Ember from 'ember';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';

export default Ember.Route.extend( RouteMetaMixin, {

  meta: function() {
    let department = this.controllerFor('people').get('department'),
        title      = 'AcmeCo: People';

    if (department)
      title += " / " + department;

    return {
      "property": {
        "og:name": title,
        "og:image": "//www.acmeco.com/logo.png"
      },
      "name": {
        "twitter:title": title,
        "twitter:image": "//www.acmeco.com/logo.png"
      }
    };
  }

});