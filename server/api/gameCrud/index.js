'use strict';

var express = require('express');
var games = require('./games.controller');

var router = express.Router();

router.get('/gameslibrary', games.getlibrary);
router.get('/hardwarelibrary', games.getHWLibrary);
router.get('/gameswishlist', games.getGamesWishlist);
router.get('/consolewl', games.getConsoleWishlist);

router.get('/simplegameauth/:user/:pass', games.simpleAuth);
router.get('/checktoken/:token', games.checkToken);

router.get('/getgameswl', games.getGamesWl);

router.post('/gamesadd', games.gamesAdd);
router.post('/gamesedit', games.gamesEdit);
router.post('/gamesdelete', games.gamesDelete);

router.get('/sendbackup', games.sendBackup);

module.exports = router;
