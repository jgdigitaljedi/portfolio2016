var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId; // I don't know, maybe I add some stuff later and want them to have IDs

var hsSchema = new Schema({
	id: ObjectId,
	name: String,
	dateTime: String,
	score: Number,
	which: String
});

var Scores = mongoose.model('Scores', hsSchema);

module.exports = Scores;