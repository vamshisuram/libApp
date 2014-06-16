var mongoOpt = { url: 'mongodb://localhost/nineleaps_library' };

var Schema = require('jugglingdb').Schema;
var mongoSchema = new Schema('mongodb', mongoOpt);

module.exports = function (compound, User) {
  var User = mongoSchema.define('User', {
    id: {type: Number},
    username: {type: String},
    email: {type: String},
    password: {type: String},
    role: {type: String},
    createdAt: {type: Date}
  });

  compound.models.User = User;
};
