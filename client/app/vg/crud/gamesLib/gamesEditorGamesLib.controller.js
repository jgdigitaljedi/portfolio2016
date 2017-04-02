'use strict';

angular.module('portfolioApp').controller('EditGamesLibCtrl', ['VgData',
  function (VgData) {
    var eglc = this;
    console.log('games edit ctrl');
    eglc.formOptions = {
      title: 'Add a Game',
      which: 'games',
      gbSearch: 'game',
      type: 'Game',
      endpoints: {add: 'addGame', edit: 'editGame', delete: 'deleteGame', get: 'getOwnedGames'},
      inputs: [
        {name: 'gbId', display: 'GiantBomb ID', link: 'http://www.giantbomb.com', required: true},
        {name: 'addeddate', display: 'Date Added (MM/DD/YYYY)', required: true},
        {name: 'price', display: 'Value', link: 'https://www.pricecharting.com/', required: true},
        {name: 'cib', display: 'Box/Case/Sleeve/Loose/DL', required: true}
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
        {'mDataProp': 'cib', title: 'Box/Case'},
        {'mDataProp': null, 'bSortable': false, 'mRender': function (o) {return '<button class="game-delete">Delete</button>';}}
      ],
      deleteRow: true,
      toastScrollContainer: '#tab-content-0'
    }
  }
]);

// {'mDataProp': 'price', title: 'Value', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}},
