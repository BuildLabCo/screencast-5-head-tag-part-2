import DS from 'ember-data';

export default DS.Model.extend({

  name:   DS.attr('string'),
  image:  DS.attr(),
  department: DS.attr('string'),
  bio: DS.attr(),
  numReports: DS.attr('number'),
  gender: DS.attr('string')

});