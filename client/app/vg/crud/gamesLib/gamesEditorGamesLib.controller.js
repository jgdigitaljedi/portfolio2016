'use strict';

angular.module('portfolioApp').controller('EditGamesLibCtrl', ['VgData',
  function (VgData) {
    var eglc = this;
    console.log('games edit ctrl');
    eglc.formOptions = {
      title: 'Add a Game',
      which: 'games',
      gbSearch: 'game',
      submitEvent: 'editGames',
      editEndpoint: '',
      inputs: [
        {name: 'gbId', display: 'GiantBomb ID', link: 'http://www.giantbomb.com', type: 'number'},
        {name: 'dateAdded', display: 'Date Added', type: 'date'},
        {name: 'value', display: 'Value', link: 'https://www.pricecharting.com/', type: 'currency'}
      ]
    }
  }
]);

