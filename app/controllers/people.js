import Ember from 'ember';
import ENV from 'diy/config/environment';

export default Ember.Controller.extend({

  queryParams:  ["department","gender"],
  department:   null,
  gender:       null,

  updateMeta: function(){
    this.send('reloadMeta');
  }.observes('department'),

  departments: function() {
    let content = Ember.A(),
        depts = _.chain(this.get('model.content'))
          .map((item) => item.get('department'))
          .uniq()
          .value();

    depts.forEach((d) => {
      content.push({ name: d, icon: ENV.departmentIcons[d] || "exclamation-triangle" });
    });

    return content;

  }.property('model.@each.deparment','model.[]'),

  filteredPeople: function() {
    let people = this.get('model.content'),
        dept   = this.get('department'),
        gender = this.get('gender');

    if (dept) {
      people = _.filter(people, (item) => item.get('department') === dept);
    }

    if (!Ember.isEmpty(gender)) {
      people = _.filter(people, (item) => item.get('gender') === gender);
    }

    return people;
  }.property('department','gender')

});