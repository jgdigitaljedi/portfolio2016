'use strict';

angular.module('portfolioApp').controller('EditConWlCtrl', [
  function () {
    var egcwl = this;
    console.log('games edit console wl ctrl');
    egcwl.formOptions = {
      title: 'Add a Console to Wish List',
      which: 'consoleWl',
      type: 'Console',
      gbSearch: 'platform',
      endpoints: {add: 'addConsoleWl', edit: 'editConsoleWl', get: 'getConsoleWishlist', delete: 'deleteConsoleWl'},
      inputs: [
        {name: 'gbId', display: 'GiantBomb ID', link: 'http://www.giantbomb.com', required: true},
        {name: 'addeddate', display: 'Date Added (MM/DD/YYYY)', required: true},
        {name: 'price', display: 'Value', link: 'https://www.ebay.com/', required: true}
      ],
      resultFields: [
        {field: 'name', label: 'Name'},
        {field: 'releaseYear', label: 'Year Released'},
        {field: 'ebayPrice', label: 'Price on Ebay'},
        {field: 'gbId', label: 'Giantbomb ID'}
      ],
      consoleDd: false,
      toast: {
        trigger: false,
        options: {}
      },
      paramsArr: ['addeddate', 'gbId', 'genre', 'price', 'rating', 'releasedate', 'title'],
      dataTable: [
        {'mDataProp': 'name', title: 'Name'},
        {'mDataProp': 'releaseYear', title: 'Year Released'},
        {'mDataProp': 'ebayPrice', title: 'Price on Ebay'},
        {'mDataProp': 'gbId', title: 'Ginatbomb ID'},
        {'mDataProp': 'addeddate', title: 'Added'},
        {'mDataProp': null, 'bSortable': false, 'mRender': function (o) {return '<button class="game-delete">Delete</button>';}},
        {'mDataProp': null, 'bSortable': false, 'mRender': function (o) {return '<button class="extra-action">Move to Library</button>';}}
      ],
      deleteRow: true,
      extraAction: {
        type: 'modal'
      }
    }
  }
]);

