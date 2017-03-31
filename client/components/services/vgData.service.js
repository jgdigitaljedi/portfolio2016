'use strict';
/*jshint camelcase: false */
/*global moment: false */

angular.module('portfolioApp').service('VgData', ['$q', '$http',
  function ($q, $http) {

    //****************************
    //**** helpers ***************
    //****************************

    function formatPrice (price) {
      console.log('price', price);
      if (price > 0) {
        return '$' + parseFloat(price).toFixed(2);
      } else {
        return '$0.00';
      }

    }

    function getData (which, auth) {
      var def = $q.defer(),
        path = auth ? '' : '/api/games/';
      $http.get(path + which)
      .then(function (data) {
        if (auth) {
          def.resolve(data);
        } else {
          if (!data.data.error) {
            def.resolve(data.data.data);
          } else {
            console.warn('data error', data);
            def.resolve(data.data.data);
          }
        }
      })
      .catch(function (data) {
        console.warn('data error', data);
        def.resolve(data);
      });
      return def.promise;
    }

    function postWithJson (which, params) {
      var def = $q.defer();
      $http({
        method: 'POST',
        url: '/api/games/' + which,
        dataType: 'application/json',
        data: params
      })
        .then(function (response) {
          def.resolve(response);
        })
        .catch(function (err) {
          def.reject(err);
        });
      return def.promise;
    }

    //**********************************
    //**** getters (mainly for tables)**
    //**********************************

    function getOwnedGames (noclean) {
      var def = $q.defer();
      getData('gameslibrary').then(function (response) {
        if (!response.error) {
          response.games.forEach(function (item) {
            if (!noclean) {
              if (!item.price || item.price === 0) {
                item.price = {
                  filter: null,
                  display: '--'
                };
              } else {
                item.price = {
                  filter: item.price,
                  display: formatPrice(item.price)
                };
              }
              if (!item.genre) {
                item.genre = '--';
              }
            }
          });
          def.resolve(response.games);
        } else {
          console.warn('game lib error', response);
          def.reject({error: true, message: 'error retrieving game library'});
        }
      });
      return def.promise;
    }

    function getGamesWishlist (noclean) {
      var def = $q.defer();
      getData('getgameswl').then(function (response) {
        if (!response.error) {
          response.games.forEach(function (item) {
            if (!noclean) {
              if (!item.price || item.price === 0) {
                item.price = {
                  filter: null,
                  display: '--'
                };
              } else {
                item.price = {
                  filter: item.price,
                  display: formatPrice(item.price)
                };
              }
              if (!item.genre) {
                item.genre = '--';
              }
            }
          });
          def.resolve(response.games);
        } else {
          console.warn('game wl error', response);
          def.reject({error: true, message: 'error retrieving game wishlist'});
        }
      });
      return def.promise;
    }

    function getOwnedHardware () {
      var def = $q.defer();
      getData('hardwarelibrary').then(function (response) {
        response.hardware.forEach(function (item) {
          if (!item.Value) {
            item.Value = {
              filter: null,
              display: '--'
            };
          } else {
            item.Value = {
              filter: item.Value,
              display: formatPrice(item.Value)
            };
          }
          if (!item.Total) {
            item.Total = {
              filter: null,
              display: '--'
            };
          } else {
            item.Total = {
              filter: item.Total,
              display: formatPrice(item.Total)
            };
          }
        });
        def.resolve(response);
      });
      return def.promise;
    }

    function getGameWishlist () {
      var def = $q.defer();
      getData('gameswishlist').then(function (response) {
        var dataArr = [];
        for (var key in response) {
          for (var game in response[key]) {
            if (key === 'PS4') {
            }
            dataArr.push({
              console: key,
              price: {
                filter: response[key][game].price,
                display: response[key][game].price ? formatPrice(response[key][game].price) : '--'
              },
              cib: {
                filter: response[key][game].price_CIB || '--',
                display: response[key][game].price_CIB ? formatPrice(response[key][game].price_CIB) : '--'
              },
              game: response[key][game].games});
          }
        }
        def.resolve(dataArr);
      });
      return def.promise;
    }

    function getConsoleWishlist () {
      var def = $q.defer();
      getData('consolewl').then(function (response) {
        var consoles = response.games.map(function (item) {
            item.ebayPrice = {
              filter: item.ebayPrice,
              display: formatPrice(item.ebayPrice)
            };
            return item;
          });
        def.resolve(consoles);
      });
      return def.promise;
    }

    //*******************************
    //** helpers for tables**********
    //*******************************

    function genreTracker (genre, data) {
      var gen = genre.split(',');
      if (gen.length > 1) {
        gen.forEach(function (item) {
          item = item.trim();
          if (!data.hasOwnProperty(item)) {
            data[item] = 1;
          } else {
            data[item]++;
          }
        });
      } else {
        if (!data.hasOwnProperty(genre)) {
          data[genre] = 1;
        } else {
          data[genre]++;
        }
      }
    }

    function gameTotals (gameData, hwLib) {
      var gameReturn = {
          totalPrice: 0,
          count: 0,
          gamesByConsole: {}
        },
        hwData = {
          totalPrice: 0,
          items: 0,
          hwByConsole: {}
        },
        genreObj = {},
        genresCleaned = [];
      gameData.forEach(function (item) {
        if (!gameReturn.gamesByConsole.hasOwnProperty(item.platform)) gameReturn.gamesByConsole[item.platform] = {items: 0, total: 0};
        gameReturn.gamesByConsole[item.platform].items++;
        gameReturn.gamesByConsole[item.platform].total += item.price.filter !== null ? parseFloat(parseFloat(item.price.filter).toFixed(2)) : 0;
        gameReturn.totalPrice += item.price.filter;
        gameReturn.count++;
        genreTracker(item.genre, genreObj);
      });
      for (var key in gameReturn.gamesByConsole) {
        gameReturn.gamesByConsole[key].total = parseFloat(gameReturn.gamesByConsole[key].total.toFixed(2));
      }
      gameReturn.genres = genreObj;

      // hw data
      hwLib.hardware.forEach(function (item) {
        hwData.items += item.Quantity;
        hwData.totalPrice += item.Total.filter;
        if (!hwData.hwByConsole[item.Console]) hwData.hwByConsole[item.Console] = {items: 0, total: 0};
        hwData.hwByConsole[item.Console].items++;
        hwData.hwByConsole[item.Console].total += item.Total.filter;
      });

      var objCount = 0;
      for (var j in genreObj) {
        genresCleaned.push({genre: j, count: genreObj[j], colorIndex: objCount});
        objCount++;
      }
      return {gameLib: gameReturn, hwLib: hwData, genres: genresCleaned};
    }

    //********************************
    //** game editor auth ************
    //********************************

    function gamesAuth (options) {
      var def = $q.defer(),
        which = '/api/games/simplegameauth/' + options.user + '/' + options.pass;
      getData(which, true)
        .then(function (response) {
          console.log('vgdata auth response', response);
          def.resolve(response);
        })
        .catch(function (err) {
          def.reject(err);
        });
      return def.promise;
    }

    function checkToken (token) {
      var def = $q.defer(),
        which = '/api/games/checktoken/' + token;
      getData(which, true).then(function (response) {
        if (!response.error) {
          def.resolve(response);
        } else {
          def.resolve(response);
        }

      });
      return def.promise;
    }

    //**************************
    //** game editor setters ***
    //**************************

    function fileForRequest (ep) {
      var epParams;
      switch (ep) {
        case 'addGame':
          epParams = {endpoint: 'gamesAdd', file: 'gameLibrary.json'};
          break;
        case 'addGameWl':
          epParams = {endpoint: 'gamesAdd', file: 'newGameWl.json'};
          break;
        case 'addConsoleWl':
          epParams = {endpoint: 'gamesAdd', file: 'hardwareWishlist.json'};
          break;
        case 'editGame':
          epParams = {endpoint: 'gamesEdit', file: 'gameLibrary.json'};
          break;
        case 'editGameWl':
          epParams = {endpoint: 'gamesEdit', file: 'newGameWl.json'};
          break;
        case 'editConsoleWl':
          epParams = {endpoint: 'gamesEdit', file: 'hardwareWishlist.json'};
          break;
        case 'deleteGame':
          epParams = {endpoint: 'gamesDelete', file: 'gameLibrary.json'};
          break;
        case 'deleteGameWl':
          epParams = {endpoint: 'gamesDelete', file: 'newGameWl.json'};
          break;
        case 'deleteConsoleWl':
          epParams = {endpoint: 'gamesDelete', file: 'hardwareWishlist.json'};
          break;
        default:
          epParams = false;
          break;
      }
      return epParams;
    }

    function editorCall (request, ep) {
      var def = $q.defer();
      console.log('editor call', ep);
      console.log('editor call request', request);
      var params = fileForRequest(ep),
        endpoint = params.endpoint;
      request.file = params.file;
      if (params) {
        postWithJson(endpoint, request)
          .then(function (result) {
            console.log('editor call result', result);
            def.resolve(result);
          })
          .catch(function (err) {
            console.log('editor call error in vgdata');
            def.reject({error: true, message: 'editor call error'});
          });
      } else {
        def.reject({error: true, message: 'error with request'});
      }

      return def.promise;
    }

    return {
      getOwnedGames: getOwnedGames,
      getOwnedHardware: getOwnedHardware,
      getGameWishlist: getGameWishlist,
      getConsoleWishlist: getConsoleWishlist,
      gameTotals: gameTotals,
      gamesAuth: gamesAuth,
      checkToken: checkToken,
      getGamesWishlist: getGamesWishlist,
      editorCall: editorCall
    };
  }
]);
