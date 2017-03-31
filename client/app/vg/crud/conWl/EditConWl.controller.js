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
        {name: 'ebayPrice', display: 'Price on Ebay', link: 'https://www.ebay.com/', required: true}
      ],
      resultFields: [
        {field: 'name', label: 'Name'},
        {field: 'company.name', label: 'Company'},
        {field: 'release_date', label: 'Release Date'},
        {field: 'install_base', label: 'Install Base'},
        {field: 'original_price', label: 'Original Price'}
      ],
      consoleDd: false,
      toast: {
        trigger: false,
        options: {}
      },
      paramsArr: ['addeddate', 'gbId', 'ebayPrice', 'releasedate', 'title', 'installBase', 'companyName', 'originalPrice'],
      dataTable: [
        {'mDataProp': 'title', title: 'Name'},
        {'mDataProp': 'companyName', title: 'Company'},
        {'mDataProp': 'releasedate', title: 'Date Released'},
        {'mDataProp': 'ebayPrice.display', title: 'Price on Ebay'},
        {'mDataProp': 'gbId', title: 'Giantbomb ID'},
        {'mDataProp': 'installBase', title: 'Units Sold'},
        {'mDataProp': 'originalPrice', title: 'Orig. Price'},
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

