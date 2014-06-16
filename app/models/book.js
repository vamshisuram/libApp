var mongoOpt = { url: 'mongodb://localhost/nineleaps_library' };

var Schema = require('jugglingdb').Schema;
var mongoSchema = new Schema('mongodb', mongoOpt);

module.exports = function (compound, Book) {
  var Book = mongoSchema.define('Book', {
    id: {type: Number},
    title: {type: String},
    authors: {type: String, default: new Array()},
    category: {type: String},
    level: {type: String},
    availability: {type: String},
    numOfCopies: {type: Number},
    summary: {type: String}
  });

  compound.models.Book = Book;
};
