'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('GamesDialogCtrl', ['game', '$q', '$mdDialog',
  function (game, $q, $mdDialog) {
    var gd = this,
      dateFormats = 'MMM D, YYYY',
      screenHeight = window.innerHeight,
      screenWidth = window.innerWidth;

    gd.height = (screenHeight - 20) + 'px';
    gd.width = (screenWidth > 1280 ? 1000 : screenWidth - 20) + 'px';
    gd.infoWidth = screenWidth < 960 ? '100%' : '60%';

    gd.gameInfo = game;
    gd.releaseDate = moment(game.original_release_date).format(dateFormats);
    gd.concattedGenres = gd.gameInfo.genres ? gd.gameInfo.genres.map(function (item, index) {
        return item.name ? item.name : 'UNKNOWN';
      }).join(', ') : 'UNKNOWN';

    gd.concattedPublishers = gd.gameInfo.publishers ? gd.gameInfo.publishers.map(function (item, index) {
        return item.name ? item.name : 'UNKNOWN';
      }).join(', ') : 'UNKNOWN';

    gd.concattedPlatforms = gd.gameInfo.platforms ? gd.gameInfo.platforms.map(function (item, index) {
        return item.name ? item.name : 'UNKNOWN';
      }).join(', ') : 'UNKNOWN';

    gd.concattedSimilar = gd.gameInfo.similar_games ? gd.gameInfo.similar_games.map(function (item, index) {
        return item.name ? item.name : 'UNKOWN';
      }).join(', ') : 'UNKNOWN';

    gd.concattedThemes = gd.gameInfo.themes ? gd.gameInfo.themes.map(function (item, index) {
        return item.name ? item.name : 'UNKOWN';
      }).join(', ') : 'UNKNOWN';

    gd.closeDialog = function () {
      $mdDialog.hide();
    };
  }
]);
