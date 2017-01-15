'use strict';
/*jshint camelcase: false */
/*global moment: false */

angular.module('portfolioApp').service('VgData', ['$q', '$http',
  function ($q, $http) {

    function formatPrice (price) {
      return '$' + price.toFixed(2);
    }

    function getData (which) {
      var def = $q.defer();
      $http.get('/api/proxy/' + which)
      .success(function (data) {
        if (!data.error) {
          def.resolve(data.data);
        } else {
          console.warn('data error', data);
          def.resolve(data.data);
        }
      })
      .error(function (data) {
        console.warn('data error', data);
        def.reject(data);
      });
      return def.promise;
    }

    function getOwnedGames () {
      var def = $q.defer();
      getData('gameslibrary').then(function (response) {
        if (!response.error) {
          // buildGameLibraryTable(response);
          response.games.forEach(function (item) {
            if (!item.price) {
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

          });
          def.resolve(response.games);
        } else {
          console.warn('game lib error', response);
          def.reject({error: true, message: 'error retrieving game library'});
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
        var consoles = response.hardwareWL.map(function (item) {
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
        genreObj = {};
      gameData.forEach(function (item) {
        if (!gameReturn.gamesByConsole.hasOwnProperty(item.platform)) gameReturn.gamesByConsole[item.platform] = {items: 0, total: 0};
        gameReturn.gamesByConsole[item.platform].items++;
        gameReturn.gamesByConsole[item.platform].total += item.price.filter !== null ? parseFloat(item.price.filter.toFixed(2)) : 0;
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
      return {gameLib: gameReturn, hwLib: hwData};
    }

    return {
      getOwnedGames: getOwnedGames,
      getOwnedHardware: getOwnedHardware,
      getGameWishlist: getGameWishlist,
      getConsoleWishlist: getConsoleWishlist,
      gameTotals: gameTotals
    };
  }
]);
