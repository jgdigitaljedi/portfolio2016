'use strict';

var path = require('path'),
  moment = require('moment'),
  fs = require('fs'),
  crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  moment = require('moment'),
  tokenInterval;

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

//*****************************
// auth route and token logic
//*****************************

function writeToJson (data, fileName) {
  var output = {};
  var file = path.join(__dirname, 'vg', fileName);
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
  } catch (err) {
    output = {error: true, message: err};
  } finally {
    if (!output.error) output = {error: false, message: 'success'};
    console.log('JSON write', output);
    return output;
  }
}

function setTokenInterval () {
  console.log('token interval reset');
  tokenInterval = setInterval(function () {
    writeToJson({token: '', timestamp: 1234}, 'tokenStorage.json');
  }, 1800000); // token good for 30 minutes after last data call made
}

function generateToken (password, user) {
  var secret = new Date() + process.env.JGSIMPLEAUTHSECRET + moment().unix() + user;
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(secret,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted.split('').reverse().join('');
}

exports.simpleAuth = function (req, res) {
  var user = req.params.user,
    pass = req.params.pass;

  if (user === process.env.JGSIMPLEAUTHUSER && pass === process.env.JGSIMPLEAUTHPASS) {
    var token = generateToken(pass, user);
    writeToJson({token: token, timestamp: moment().unix()}, 'tokenStorage.json');
    res.status(200).send({error: false, token: token, message: 'Welcome Joey!'});
  } else {
    res.status(401).send({error: true, message: 'ACCESS DENIED!'});
  }
};

exports.checkToken = function (req, res) {
  var token = req.params.token;
  fs.readFile(path.join(__dirname,'vg/tokenStorage.json'), 'utf-8', function (err, data) {
    var returnData = {},
      status;

    if (!err) {
      var storedToken = JSON.parse(data),
        now = moment().unix();
      if (storedToken.token === token && ((now - storedToken.timestamp) <= 900)) {
        status = 200;
        returnData = {error: false, loggedIn: true, message: 'Success'};
        clearInterval(tokenInterval);
        setTokenInterval();
      } else {
        status = 401;
        returnData = {error: false, loggedIn: false, message: 'Wrong token or token too old (ACCESS DENIED)'};
      }
    } else {
      returnData = {error: true, loggedIn: false, message: err};
      status = 500;
    }
    res.status(status).send(returnData);
  });
};

exports.addGame = function(req, res) {
  console.log('add game called');
};

exports.addConsole = function(req, res) {
  console.log('add console called');
};

exports.editGame = function(req, res) {
  console.log('edit game called');
};
