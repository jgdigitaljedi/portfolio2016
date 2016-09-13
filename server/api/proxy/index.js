
'use strict';

// proxy routing to hide api keys by making requests from server
module.exports = function(app) {
	var proxy = require('./proxy.controller'),
        morning = require('./morning.controller'),
        yelp = require('./yelp.controller');
	app.route('/conditions/:loc').get(proxy.conditions);
	app.route('/lastfm').get(proxy.lastfm);
	app.route('/lastart/:band').get(proxy.lastArt);
	app.route('/contact').post(proxy.sendMail);  // Contact form route
	app.route('/morning').get(morning.getInfo);
	app.route('/mygithub').get(proxy.myGithub);
	app.route('/afterwork').get(morning.getHomeCommute);
	app.route('/getYelpInfo/:lat/:long').get(yelp.getYelpInfo);
};