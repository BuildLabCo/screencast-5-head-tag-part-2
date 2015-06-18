import Ember from 'ember';

export default Ember.Route.extend({
  
  // so now we want to add the department to our meta
  // but now when we change department filters
  // the department isn't updating
  meta: function() {
    let department = this.controllerFor('people').get('department'),
        title = "AcmeCo: People";

    if (department)
      title += " / " + department;

    return {
      property: {
        "og:name":  title,
        "og:image": "//www.acmeco.com/logo.png"
      },
      name: {
        "twitter:title": title,
        "twitter:image": "//www.acmeco.com/logo.png"
      }
    }
  },
});