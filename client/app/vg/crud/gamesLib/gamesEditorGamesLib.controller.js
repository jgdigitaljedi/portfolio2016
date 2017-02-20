'use strict';

angular.module('portfolioApp').controller('EditGamesLibCtrl', ['VgData',
  function (VgData) {
    var eglc = this;
    console.log('games edit tabs ctrl');
    eglc.formOptions = {
      inputs: {

      },
      submitEvent: 'editGames',
      editEndpoint: ''

    }
  }
]);

