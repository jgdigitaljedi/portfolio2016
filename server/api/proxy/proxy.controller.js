'use strict';

var request = require('request'),
	nodemailer = require('nodemailer'),
	smtpTransport = require('nodemailer-smtp-transport'),
	path = require('path');
	
exports.conditions = function(req, res) {
	//console.log('weather conditions proxy used', req.params.loc);
	var state = req.params.state,
		city = req.params.city,
		url = 'http://api.wunderground.com/api/' + process.env.JWUKEY + '/geolookup/conditions/q/' + state +
			'/' + city + '.json';

	request.get(
	    url,
		function (error, response, body) {
	        if (!error && response.statusCode === 200) {
	          	var obj = JSON.parse(body);
	            res.json(obj);
	        }
	    }
	);
};

exports.lastfm = function(req, res) {
	//console.log('lastfm proxy used');
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=joeygstrings&api_key=' + 
		process.env.JLASTKEY + '&format=json';
	request.get(
	    url,
		function (error, response, body) {
	        if (!error && response.statusCode === 200) {
	          	var obj = JSON.parse(body);
	            return res.json(obj);
	        } else {
	        	return res.json({error: true, message: error});
	        }
	    }
	);
};

exports.lastfmWeeklyArtists = function (req, res) {
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=joeygstrings&api_key=' +
		process.env.JLASTKEY + '&format=json';
	request.get(
	    url,
		function (error, response, body) {
	        if (!error && response.statusCode === 200) {
	          	var obj = JSON.parse(body);
	            return res.json(obj);
	        } else {
	        	return res.json({error: true, message: response, error: error, body: body});
	        }
	    }
	);
};

exports.lastfmWeeklyTracks = function (req, res) {
	// /2.0/?method=user.getweeklytrackchart&user=rj&api_key=
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=joeygstrings&api_key=' +
		process.env.JLASTKEY + '&format=json';
	request.get(
	    url,
		function (error, response, body) {
	        if (!error && response.statusCode === 200) {
	          	var obj = JSON.parse(body);
	            return res.json(obj);
	        } else {
	        	return res.json({error: true, message: response, error: error, body: body});
	        }
	    }
	);
};

exports.lastArt = function (req, res) {
	var data = req.params.band,
		theUrl =  'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + data + '&api_key=' + 
			process.env.JLASTKEY + '&format=json';

    function callback (error, response, body) {
        if (!error && response.statusCode === 200) {
            var obj = JSON.parse(body);
            res.json(obj);
        } else {
            res.send('error dude!', req);
        }
    }
    request({url: theUrl}, callback);
};

exports.sendMail = function(req, res) {
	var company,
		transporter = nodemailer.createTransport(
			{
				service: 'yahoo',
				auth: {
					user: process.env.JYAHOOUSER,
					pass: process.env.JYAHOOPASS
				}
			}
		),
 		data = req.body;
 	if(data.company !== undefined || data.company !== '') {
		company = ' with ' + data.company;
	} else {
		company = '';
	}
    transporter.sendMail({
        from: process.env.JYAHOOUSER,
        to: process.env.JPERSONALEMAIL,
        subject: 'Message from ' + data.firstName + ' ' + data.lastName + company,
        text: data.comment
    }, function(error, response){  //callback
			if(error) {
			    return res.json({error: true});
			} else {
    			return res.json({error: false});
			}
		}
   
   	);
 	transporter.close();
};

exports.myGithub = function (req, res) {
    var options = {
        url: 'https://api.github.com/users/jgdigitaljedi/repos',
        headers: {
            'User-Agent': 'jgdigitaljedi'
        }
    };

    function callback (error, response, body) {
        if (!error && response.statusCode === 200) {
            var obj = JSON.parse(body);
            res.json(obj);
        } else {
            res.send('error dude!');
        }
    }

    request(options, callback);
};