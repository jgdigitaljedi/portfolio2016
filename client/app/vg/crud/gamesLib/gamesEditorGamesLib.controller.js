'use strict';

angular.module('portfolioApp').controller('EditGamesLibCtrl', ['VgData',
  function (VgData) {
    var eglc = this;
    console.log('games edit ctrl');
    eglc.formOptions = {
      title: 'Add a Game',
      which: 'games',
      gbSearch: 'game',
      editEndpoint: '',
      inputs: [
        {name: 'gbId', display: 'GiantBomb ID', link: 'http://www.giantbomb.com', required: true},
        {name: 'addeddate', display: 'Date Added', required: true},
        {name: 'price', display: 'Value', link: 'https://www.pricecharting.com/', required: true}
      ],
      resultFields: [
        {field: 'name', label: 'Title'},
        {field: 'original_game_rating', label: 'Rating'},
        {field: 'original_release_date', label: 'Release Date'},
        {field: 'genres', label: 'Genres'}
      ],
      consoleDd: true
    }
  }
]);

