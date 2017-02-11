'use strict';

var express = require('express');
var games = require('./games.controller');

var router = express.Router();

router.get('/gameslibrary', games.getlibrary);
router.get('/hardwarelibrary', games.getHWLibrary);
router.get('/gameswishlist', games.getGamesWishlist);
router.get('/consolewl', games.getConsoleWishlist);

router.get('/simplegameauth/:user/:pass', games.simpleAuth);
router.post('/addgame', games.addGame);
router.post('/addconsole', games.addConsole);
router.post('/editgame', games.editGame);
router.post('/editconsole', games.editConsole);

module.exports = router;
