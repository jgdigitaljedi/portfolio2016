'use strict';

var express = require('express');
var proxy = require('./proxy.controller'),
    morning = require('./morning.controller'),
    yelp = require('./yelp.controller');

var router = express.Router();

router.get('/lastfm', proxy.lastfm);
router.get('/conditions/:state/:city', proxy.conditions);
router.get('/lastart/:band', proxy.lastArt);
router.get('/lastfmweeklyartists', proxy.lastfmWeeklyArtists);
router.get('/lastfmweeklytracks', proxy.lastfmWeeklyTracks);
router.post('/contact', proxy.sendMail);
router.get('/morning', morning.getInfo);
router.get('/mygithub', proxy.myGithub);
router.get('/afterwork', morning.getHomeCommute);
router.get('/getYelpInfo/:lat/:long', yelp.getYelpInfo);

module.exports = router;