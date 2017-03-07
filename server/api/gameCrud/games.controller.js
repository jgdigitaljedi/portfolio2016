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

// function findById (id, fileName, param) {
//   return new Promise(function (resolve, reject) {
//     fs.readFile(path.join(__dirname,'vg/' + fileName), 'utf-8', function (err, data) {
//       if (err) reject('file read error');
//       var found = false;
//       if (param) {
//         data[param].forEach(function (item, index) {
//           if (item.id === id) {
//             found = true;
//             resolve({item: item, index: index});
//           }
//         });
//         if (!found) reject('no match found');
//       } else {
//         data.forEach(function (item, index) {
//           if (item.id === id) {
//             found = true;
//             resolve(item);
//           }
//         });
//         if (!found) reject('no match found');
//       }
//     });
//   });
// }

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
  // fs.readFile(path.join(__dirname, 'vg/newGameWl.json'), 'utf-8', function (err, data) {
  //   var data = JSON.parse(data);
  //   data.games.forEach(function (item, index) {
  //     item.rating = 'not set';
  //     item.releasedate = '01/01/1900';
  //     item.addeddate = '01/01/1900';
  //   });
  //   writeToJson(data, 'newGameWl.json');
  // });


  // fs.readFile(path.join(__dirname, 'vg/gameWishlist.json'), 'utf-8', function (err, data) {
  //   var data = JSON.parse(data),
  //     result = {games: []};
  //   for (var con in data) {
  //     for (var game in data[con]) {
  //       result.games.push({title: data[con][game].games, price: data[con][game].price, platform: con});
  //     }
  //   }
  //   writeToJson(result, 'newGameWl.json');
  //   console.log('result', result);
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

exports.addGame = function(req, res) {
  validateToken(req.body.gameRequest.token, true)
    .then(function (loggedIn) {
      fs.readFile(path.join(__dirname,'vg/gameLibrary.json'), 'utf-8', function (err, data) {
        var oldData = JSON.parse(data),
          reqData = req.body.gameRequest.gameData;
        reqData.price = parseFloat(reqData.price);
        oldData.games.push(reqData);
        writeToJson(oldData, 'gameLibrary.json');
        res.status(200).send({error: false, message: 'Game Successfully Added'});
      });
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};

exports.addConsole = function(req, res) {
  console.log('add console called');
};

exports.editGame = function(req, res) {
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/gameLibrary.json'), 'utf-8', function (err, data) {
          var newGameData = req.body.game,
            gameLib = JSON.parse(data);

          gameLib.games.forEach(function (item, index) {
            if (parseInt(newGameData.id) === parseInt(item.id)) {
              gameLib.games[index] = newGameData;
            }
          });
          writeToJson(gameLib, 'gameLibrary.json');
          res.status(200).send({error: false, message: newGameData.title + ' added!'})
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};

exports.deleteGame = function (req, res) {
  console.log('deleteGame called');
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/gameLibrary.json'), 'utf-8', function (err, data) {
          var delGame = req.body.game,
            gameLib = JSON.parse(data);

          gameLib.games.forEach(function (item, index) {
            if (parseInt(delGame.id) === parseInt(item.id)) {
              gameLib.games.splice(index, 1);
            }
          });
          writeToJson(gameLib, 'gameLibrary.json');
          res.status(200).send({error: false, message: delGame.title + ' deleted!'})
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};

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

exports.addGameWl = function (req, res) {
  console.log('addGameWl called');
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/newGameWl.json'), 'utf-8', function (err, data) {
          var addGame = req.body.game,
            gameWl = JSON.parse(data);

          addGame.price = parseFloat(reqData.price);
          gameWl.games.push(addGame);
          writeToJson(gameWl, 'newGameWl.json');
          res.status(200).send({error: false, message: 'Game Successfully Added to WL'});
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};

exports.editGameWl = function(req, res) {
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/newGameWl.json'), 'utf-8', function (err, data) {
          var newGameData = req.body.game,
            gameWl = JSON.parse(data);

          gameWl.games.forEach(function (item, index) {
            if (parseInt(newGameData.id) === parseInt(item.id)) {
              gameWl.games[index] = newGameData;
            }
          });
          writeToJson(gameWl, 'newGameWl.json');
          res.status(200).send({error: false, message: newGameData.title + ' added!'})
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};

exports.deleteGameWl = function (req, res) {
  console.log('deleteGameWl called');
  validateToken(req.body.token, true)
    .then(function (loggedIn) {
      if (!loggedIn.error) {
        fs.readFile(path.join(__dirname, 'vg/newGameWl.json'), 'utf-8', function (err, data) {
          var delGame = req.body.game,
            gameLib = JSON.parse(data);

          gameLib.games.forEach(function (item, index) {
            if (parseInt(delGame.id) === parseInt(item.id)) {
              gameLib.games.splice(index, 1);
            }
          });
          writeToJson(gameLib, 'newGameWl.json');
          res.status(200).send({error: false, message: delGame.title + ' deleted!'})
        });
      }
    })
    .catch(function (err) {
      res.status(401).send({error: true, message: 'Access Denied: Bad Token'});
    });
};
