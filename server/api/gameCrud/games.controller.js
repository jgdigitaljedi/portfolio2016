'use strict';

var path = require('path'),
  moment = require('moment'),
  fs = require('fs'),
  crypto = require('crypto'),
  algorithm = 'aes-256-ctr';

exports.addGame = function(req, res) {
  console.log('add game called');
};

exports.addConsole = function(req, res) {
  console.log('add console called');
};

exports.editGame = function(req, res) {
  console.log('edit game called');
};

exports.editConsole = function(req, res) {
  console.log('edit console called');
};

exports.getlibrary = function (req, res) {
  fs.readFile(path.join(__dirname,'vg/gameLibrary.json'), 'utf-8', function (err, data) {
    var returnData = {},
      status;
    // if (err.code !== 'ENOENT') throw err;
    if (!err) {
      returnData = {error: false, data: JSON.parse(data)};
      status = 200;
    } else {
      returnData = {error: true, data: err};
      status = 500;
    }
    res.status(status).send(returnData);
  });
};

exports.getHWLibrary = function (req, res) {
  fs.readFile(path.join(__dirname, 'vg/hardwareLibrary.json'), 'utf-8', function (err, data) {
    var returnData = {},
      status;
    // if (err.code !== 'ENOENT') throw err;
    if (!err) {
      returnData = {error: false, data: JSON.parse(data)};
      status = 200;
    } else {
      returnData = {error: true, data: err};
      status = 500;
    }
    res.status(status).send(returnData);
  });
};

exports.getGamesWishlist = function (req, res) {
  fs.readFile(path.join(__dirname, 'vg/gameWishlist.json'), 'utf-8', function (err, data) {
    var returnData = {},
      status;
    // if (err.code !== 'ENOENT') throw err;
    if (!err) {
      returnData = {error: false, data: JSON.parse(data)};
      status = 200;
    } else {
      returnData = {error: true, data: err};
      status = 500;
    }
    res.status(status).send(returnData);
  });
};

exports.getConsoleWishlist = function (req, res) {
  fs.readFile(path.join(__dirname, 'vg/hardwareWishlist.json'), 'utf-8', function (err, data) {
    var returnData = {},
      status;
    // if (err.code !== 'ENOENT') throw err;
    if (!err) {
      returnData = {error: false, data: JSON.parse(data)};
      status = 200;
    } else {
      returnData = {error: true, data: err};
      status = 500;
    }
    res.status(status).send(returnData);
  });

};

exports.simpleAuth = function (req, res) {
  var user = req.params.user,
    pass = req.params.pass;

  function generateToken (password) {
    var secret = process.env.JGSIMPLEAUTHSECRET + new Date();
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(secret,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  if (user === process.env.JGSIMPLEAUTHUSER && pass === process.env.JGSIMPLEAUTHPASS) {
    var token = generateToken(pass);

    res.status(200).send({error: false, token: token, message: 'Welcome Joey!'});
  } else {
    res.status(401).send({error: true, message: 'ACCESS DENIED!'});
  }
  console.log('game auth pass', pass);
  console.log('env user', process.env.JGSIMPLEAUTHPASS);
};
