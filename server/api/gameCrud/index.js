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
router.post('/deleteGame', games.deleteGame);

router.get('/getgameswl', games.getGamesWl);
router.post('/deletegamewl', games.deleteGameWl);

router.post('/gamesadd', games.gamesAdd);
router.post('/gamesedit', games.gamesEdit);
router.post('/gamesdelete', games.gamesDelete);

module.exports = router;
