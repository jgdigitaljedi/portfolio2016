'use strict';

angular.module('portfolioApp').controller('EditGamesWlCtrl', [
  function () {
    var egwl = this;
    console.log('games edit wl ctrl');
    egwl.formOptions = {
      title: 'Add a Game to Wish List',
      which: 'gamesWl',
      type: 'Game',
      gbSearch: 'game',
      endpoints: {add: 'addGameWl', edit: 'editGameWl', get: 'getGamesWl', delete: 'deleteGameWl'},
      inputs: [
        {name: 'gbId', display: 'GiantBomb ID', link: 'http://www.giantbomb.com', required: true},
        {name: 'addeddate', display: 'Date Added (MM/DD/YYYY)', required: true},
        {name: 'price', display: 'Value', link: 'https://www.pricecharting.com/', required: true}
      ],
      resultFields: [
        {field: 'name', label: 'Title'},
        {field: 'original_game_rating', label: 'Rating'},
        {field: 'original_release_date', label: 'Release Date (MM/DD/YYYY)'},
        {field: 'genres', label: 'Genres'}
      ],
      consoleDd: true,
      toast: {
        trigger: false,
        options: {

        }
      },
      paramsArr: ['addeddate', 'gbId', 'genre', 'platform', 'price', 'rating', 'releasedate', 'title'],
      dataTable: [
        {'mDataProp': 'title', title: 'Title'},
        {'mDataProp': 'platform', title: 'Platform'},
        {'mDataProp': 'genre', title: 'Genre'},
        {'mDataProp': 'price', title: 'Value'},
        {'mDataProp': 'rating', title: 'Rating'},
        {'mDataProp': 'releasedate', title: 'Released'},
        {'mDataProp': 'addeddate', title: 'Added'},
        {'mDataProp': null, 'bSortable': false, 'mRender': function (o) {return '<button class="game-delete">Delete</button>';}},
        {'mDataProp': null, 'bSortable': false, 'mRender': function (o) {return '<button class="move-to-library">Move to Library</button>';}}
      ],
      deleteRow: true
    }
  }
]);

