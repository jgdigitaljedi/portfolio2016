var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var rsSchema = new Schema({
	id: ObjectId,
	name: String,
	value: String,
	dateTime: String
});

var Randoms = mongoose.model('Random', rsSchema);

module.exports = Randoms;