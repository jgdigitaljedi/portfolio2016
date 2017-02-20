'use strict';

angular.module('portfolioApp').controller('EditGamesLibCtrl', ['VgData',
  function (VgData) {
    var eglc = this;
    console.log('games edit ctrl');
    eglc.formOptions = {
      which: 'games',
      submitEvent: 'editGames',
      editEndpoint: ''
    }
  }
]);

