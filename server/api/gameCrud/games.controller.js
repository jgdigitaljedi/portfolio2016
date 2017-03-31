'use strict';
//refactor this mess some day
// needs to be WAY DRYer
// writeToJson and others need more exception handling
// now that I've made data structures uniform I can create caller functions and just pass different json file names
//TODO: make this code not suck once I get the CRUD finished

var path = require('path'),
  moment = require('moment'),
  fs = require('fs'),
  crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  moment = require('moment'),
  Promise = require('bluebird'),
  Archiver = require('archiver'),
  http = require('http'),
  tokenInterval;

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

function validateToken (uToken, reset) {
  console.log('validating token', uToken);
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(__dirname,'vg/tokenStorage.json'), 'utf-8', function (err, data) {
      if (!err) {
        var now = moment().unix();
        data = JSON.parse(data);
        if (uToken === data.token && (now - data.timestamp <= 1800)) {
          console.log('ts good');
          if (reset) {
            data.timestamp = moment().unix();
            writeToJson(data, 'tokenStorage.json');
            clearInterval(tokenInterval);
            setTokenInterval(true, uToken);
          }
          resolve({error: false, message: 'Successful Authentication/Good Token', status: 200});
        } else {
          clearInterval(tokenInterval);
          setTokenInterval(false);
          reject({error: true, message: 'Token incorrect or too old', status: 401});
        }
      } else {
        clearInterval(tokenInterval);
        setTokenInterval(false);
        reject({error: true, message: 'Server error', status: 500});
      }
    });
  });
}

function writeToJson (data, fileName) {
  var output = {};
  var file = path.join(__dirname, 'vg', fileName);
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf-8');
  } catch (err) {
    output = {error: true, message: err};
  } finally {
    if (!output.error) output = {error: false, message: 'success'};
    return output;
  }
}

function setTokenInterval (reset, token) {
  console.log('token interval reset');
  var ts = reset ? moment().unix() : 1234,
    t = token || '';
  tokenInterval = setInterval(function () {
    writeToJson({token: t, timestamp: ts}, 'tokenStorage.json');
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
  //*****************************
  //** helper to add stuff 1 time
  //****************************


  // fs.readFile(path.join(__dirname, 'vg/hardwareWishlist.json'), 'utf-8', function (err, data) {
  //   var data = JSON.parse(data);
  //   data.hardwareWL.forEach(function (item, index) {
  //     item.addeddate = '01/01/1900';
  //   });
  //   writeToJson(data, 'hardwareWishlist.json');
  // });
  //*********************************


  var token = req.params.token;
  validateToken(token, false)
    .then(function (result) {
      res.status(result.status).send(result);
    })
    .catch(function (err) {
      res.status(500).send({error: true, message: err});
    });
};
//
// exports.deleteGame = function (req, res) {
//   console.log('deleteGame called');
//   validateToken(req.body.token, true)
//     .then(function (loggedIn) {
//       if (!loggedIn.error) {
//         fs.readFile(path.join(__dirname, 'vg/gameLibrary.json'), 'utf-8', function (err, data) {
//           var delGame = req.body.game,
//             gameLib = JSON.parse(data);
//
//           gameLib.games.forEach(function (item, index) {
//             if (parseInt(delGame.id) === parseInt(item.id)) {
//               gameLib.games.splice(index, 1);
//             }
//           });
//           writeToJson(gameLib, 'gameLibrary.json');
//           res.status(200).send({error: false, message: delGame.title + ' deleted!'})
//         });
//       }
//     })
//     .catch(function (err) {
//       res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
//     });
// };

exports.getGamesWl = function (req, res) {
  fs.readFile(path.join(__dirname,'vg/newGameWl.json'), 'utf-8', function (err, data) {
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

// exports.deleteGameWl = function (req, res) {
//   console.log('deleteGameWl called');
//   validateToken(req.body.token, true)
//     .then(function (loggedIn) {
//       if (!loggedIn.error) {
//         fs.readFile(path.join(__dirname, 'vg/newGameWl.json'), 'utf-8', function (err, data) {
//           var delGame = req.body.game,
//             gameLib = JSON.parse(data);
//
//           gameLib.games.forEach(function (item, index) {
//             if (parseInt(delGame.id) === parseInt(item.id)) {
//               gameLib.games.splice(index, 1);
//             }
//           });
//           writeToJson(gameLib, 'newGameWl.json');
//           res.status(200).send({error: false, message: delGame.title + ' deleted!'})
//         });
//       }
//     })
//     .catch(function (err) {
//       res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
//     });
// };

exports.gamesAdd = function (req, res) {
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      console.log('loggedIn', loggedIn);
      if (!loggedIn.error) {
        console.log('file', req.body.file);
        fs.readFile(path.join(__dirname, 'vg/' + req.body.file), 'utf-8', function (err, data) {
          console.log('read file fine');
          var newAdd = req.body.data,
            currentData = JSON.parse(data);

          if (newAdd.hasOwnProperty('price')) {
            newAdd.price = parseFloat(newAdd.price);
          }

          if (newAdd.hasOwnProperty('ebayPrice')) {
            newAdd.ebayPrice = parseFloat(newAdd.ebayPrice);
          }

          if (newAdd.hasOwnProperty('original_price')) {
            newAdd.original_price = parseFloat(newAdd.original_price);
          }

          currentData.games.push(newAdd);
          writeToJson(currentData, req.body.file);
          res.status(200).send({error: false, message: 'Addition successfully made'});
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token', rawMessage: err});
    });
};

exports.gamesEdit = function (req, res) {
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/' + req.body.file), 'utf-8', function (err, data) {
          var newData = req.body.data,
            list = JSON.parse(data);

          list.games.forEach(function (item, index) {
            if (parseInt(newData.id) === parseInt(item.id)) {
              list.games[index] = newData;
            }
          });
          writeToJson(list, req.body.file);
          res.status(200).send({error: false, message: newData.title + ' added!'})
        });
      }
    })
};

exports.gamesDelete = function (req, res) {
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/' + req.body.file), 'utf-8', function (err, data) {
          var delGame = req.body.data,
            gameLib = JSON.parse(data);

          gameLib.games.forEach(function (item, index) {
            if (parseInt(delGame.id) === parseInt(item.id)) {
              gameLib.games.splice(index, 1);
            }
          });
          writeToJson(gameLib, req.body.file);
          res.status(200).send({error: false, message: delGame.title + ' deleted!'})
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};

exports.sendBackup = function (req, res) {
  //use archiver to zip JSON directory and stream it back
  //gonna setup home server to do this on a cron job every few days

  var output = fs.createWriteStream(path.join(__dirname, 'vgBackup.zip'));
  var archiver =  require('archiver');
  var zipArchive = archiver('zip');

  zipArchive.pipe(output);
  zipArchive.directory(path.join(__dirname, 'vg'), true);
  zipArchive.finalize(function(err, bytes) {
    if (err)
      throw err;

    res.download(path.join(__dirname, 'vgBackup.zip'));
    console.log('done:', base, bytes);
  });

  // var archive = Archiver('zip');
  // archive.on('error', function(err) {
  //   res.status(500).send({error: err.message});
  // });
  // //set the archive name
  // res.attachment('vgBackup.zip');
  // //this is the streaming magic
  // archive.pipe(res);
  // archive.directory(__dirname + 'vg/', false);
  // archive.finalize();
};
