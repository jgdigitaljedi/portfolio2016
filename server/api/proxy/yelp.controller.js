'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    oauthSignature = require('oauth-signature'), 
	n = require('nonce')(),
	request = require('request'), 
	qs = require('querystring'),  
	_ = require('lodash'),
	keys = require('../../keys.json'),
	logger = require('tracer').colorConsole();

exports.getYelpInfo = function(req, res) {
	req = req.params;
	console.log('the req', req);
	var httpMethod = 'GET',
		url = 'http://api.yelp.com/v2/search',
		default_parameters = {
		    ll: req.lat + ',' + req.long,
		    sort: '1',
		    term: 'food'
		},
		required_parameters = {
		    oauth_consumer_key : keys.yelp_oauth_consumer_key,
		    oauth_token : keys.yelp_oauth_token,
		    oauth_nonce : n(),
		    oauth_timestamp : n().toString().substr(0,10),
		    oauth_signature_method : 'HMAC-SHA1',
		    oauth_version : '1.0'
		},
		parameters = _.assign(default_parameters, req, required_parameters),
		consumerSecret = keys.yelp_consumerSecret,
		tokenSecret = keys.yelp_tokenSecret,
		signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

	parameters.oauth_signature = signature;

	var paramURL = qs.stringify(parameters);

	var apiURL = url+'?'+paramURL;

	request(apiURL, function(error, response, body){
	    res.send({err: error, res: response, content: body});
	});
};