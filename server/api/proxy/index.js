
'use strict';

// proxy routing to hide api keys by making requests from server
module.exports = function(app) {
	var proxy = require('../../app/controllers/proxy.controller'),
        morning = require('../../app/controllers/morning.controller'),
        yelp = require('../../app/controllers/yelp.controller');
	app.route('/conditions/:loc').get(proxy.conditions);
	app.route('/lastfm').get(proxy.lastfm);
	app.route('/lastart/:band').get(proxy.lastArt);
	app.route('/contact').post(proxy.sendMail);  // Contact form route
	app.route('/morning').get(morning.getInfo);
	app.route('/mygithub').get(proxy.myGithub);
	app.route('/afterwork').get(morning.getHomeCommute);
	app.route('/getYelpInfo/:lat/:long').get(yelp.getYelpInfo);
};