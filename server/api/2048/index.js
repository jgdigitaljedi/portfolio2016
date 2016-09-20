var express = require('express');
// var app      = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var initialHighScore = {};
var dateFormat = 'MM/DD/YYYY h:mm a';
var router = express.Router();

router.use(bodyParser.json());

// mongo stuff
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/2048');
var HighScores = require('../../schemas/scores.js');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('db connected');
	HighScores.findOne({which: 'highest'}, function (err, item) {
		if (!item || err) {
			console.log('setting initial high score value');
			var newScore = {score: 0, dateTime: moment().format(dateFormat), name: 'Player 1', which: 'highest'};
			var initHs = new HighScores(newScore);
			initHs.save(function (error) {
				if (error) throw err;
			});
		}
	});
});


// read and write db
router.get('/gethighscore', function (req, res) {
	HighScores.findOne( {which: 'highest'}, function (err, item) {
		res.send(item);
	});
});

router.post('/updatescore', function (req, res) {
	var newHigh = false;
	HighScores.findOneAndUpdate({which: 'highest'},
	{$set: {name: req.body.name, dateTime: moment().format(dateFormat), score: req.body.score}}, {new: true}, function (error, item) {
		res.send({error: false, score: item});
	});
});

module.exports = router;