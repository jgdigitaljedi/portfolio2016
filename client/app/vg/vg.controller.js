'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('GamesCtrl', ['$scope', 'VgData',
	function ($scope, VgData) {
		var gc = this,
			genreObj = {},
      screenWidth = window.innerWidth;

		function glTable () {
			$('#game-library-table').DataTable({
				aaData: gc.gameLibrary,
				aoColumns: [
					{'mDataProp': 'title', title: 'Title'},
					{'mDataProp': 'platform', title: 'Platform'},
					{'mDataProp': 'genre', title: 'Genre'},
					{'mDataProp': 'price', title: 'Value', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}}
				],
				'aaSorting': [[1,'asc'], [0,'asc']],
				'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
				'iDisplayLength': -1
			});
		}

		function buildGameLibraryTable () {
			if (!gc.gameLibrary) {
			  VgData.getOwnedGames().then(function (data) {
			    gc.gameLibrary = data;
			    glTable();
        });
			} else if (!($('#game-library-table').hasClass('dataTable'))) {
        glTable();
			}
		}

		function hwTable () {
			$('#hardware-library-table').DataTable({
				aaData: gc.hwLibrary,
				aoColumns: [
					{'mDataProp': 'Accessory', title: 'Hardware'},
					{'mDataProp': 'Console', title: 'Console'},
					{'mDataProp': 'Quantity', title: 'Quantity'},
					{'mDataProp': 'Value', title: 'Value', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}},
					{'mDataProp': 'Total', title: 'Total Value', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}}
				],
				'aaSorting': [[1,'asc'], [0,'asc']],
				'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
				'iDisplayLength': -1
			});
			var table = $('#hardware-library-table').dataTable();
			table.fnClearTable();
			table.fnAddData(gc.hwLibrary.hardware);
		}

		function buildHWLibraryTable (justGet) {
			if (!gc.hwLibrary) {
			  VgData.getOwnedHardware().then(function (data) {
			    gc.hwLibrary = data;
          if (justGet) {
            libraryTotals();
          } else {
            hwTable();
          }
        });
			} else {
				if (!($('#hardware-library-table').hasClass('dataTable'))) {
					if (justGet) {
						libraryTotals();
					} else {
						hwTable();
					}
				}
			}
		}

		function gwlTable () {
			$('#games-wishlist-table').DataTable({
				aaData: gc.gamesWl,
				aoColumns: [
					{'mDataProp': 'game', title: 'Game'},
					{'mDataProp': 'console', title: 'Console'},
					{'mDataProp': 'price', title: 'Price (loose)', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}},
					{'mDataProp': 'cib', title: 'Price (CIB)', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}}
				],
				'aaSorting': [[1,'asc'], [0,'asc']],
				'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
				'iDisplayLength': -1
			});
			var table = $('#games-wishlist-table').dataTable();
			table.fnClearTable();
			table.fnAddData(gc.gamesWl);
		}

		function buildGameWishlistTable () {
			if (!gc.gamesWl) {
			  VgData.getGameWishlist().then(function (data) {
			    gc.gamesWl = data;
			    gwlTable();
        });
			} else {
				if (!($('#games-wishlist-table').hasClass('dataTable'))) {
					gwlTable();
				}
			}
		}

		function buildConsoleWLTable () {
      $('#console-wishlist-table').DataTable({
        aaData: gc.consoleWL,
        aoColumns: [
          {'mDataProp': 'name', title: 'Console'},
          {'mDataProp': 'releaseYear', title: 'Release Year'},
          {'mDataProp': 'ebayPrice', title: 'Ebay Price', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}}
        ],
        'aaSorting': [[1,'asc'], [0,'asc']],
        'iDisplayLength': -1
      });
      var table = $('#console-wishlist-table').dataTable();
      table.fnClearTable();
      table.fnAddData(gc.consoleWL);
    }

		function buildHWWishlist () {
		  if (!gc.consoleWL) {
		    VgData.getConsoleWishlist().then(function (data) {
		      gc.consoleWL = data;
		      buildConsoleWLTable();
        });
      } else if (!($('#console-wishlist-table').hasClass('dataTable'))) {
        buildConsoleWLTable();
      }
		}

		function genreTracker (genre) {
			var gen = genre.split(',');
			if (gen.length > 1) {
				gen.forEach(function (item) {
					item = item.trim();
					if (!genreObj.hasOwnProperty(item)) {
						genreObj[item] = 1;
					} else {
						genreObj[item]++;
					}
				});
			} else {
				if (!genreObj.hasOwnProperty(genre)) {
					genreObj[genre] = 1;
				} else {
					genreObj[genre]++;
				}
			}
		}

    function libraryTotals () {
      var totalsData = VgData.gameTotals(gc.gameLibrary, gc.hwLibrary);
      gc.gamesData = totalsData.gameLib;
      gc.firstGenreTable = {};
      gc.secondGenreTable = {};
      var genresLength = Object.keys(gc.gamesData.genres).length,
        counter = 1;
      gc.hwData = totalsData.hwLib;
      for (var genre in gc.gamesData.genres) {
        if (counter <= genresLength / 2) {
          gc.firstGenreTable[genre] = gc.gamesData.genres[genre];
        } else {
          gc.secondGenreTable[genre] = gc.gamesData.genres[genre];
        }
        counter++;
      }

      var pieSize = screenWidth > 550 ? 550 : screenWidth;
		  gc.genrePieOptions = {
		    width: pieSize,
        height: pieSize,
        data: totalsData.genres,
        dataValue: 'count',
        dataKey: 'genre'
      };

		  var barData = [],
        barCounter = 0;
		  for (var key in gc.gamesData.gamesByConsole) {
		    barData.push({
          con: key,
          count: gc.gamesData.gamesByConsole[key].items,
          value: gc.gamesData.gamesByConsole[key].total,
          colorIndex: barCounter
        });
		    barCounter++;
      }

		  gc.barOptions = {
		    width: pieSize,
        height: pieSize,
        data: barData,
        dataKey: 'con',
        dataValue: 'count',
        dataExtra: 'value',
        margin: {
		      top: 20,
          right: 50,
          bottom: 30,
          left: 40
        },
        xLabelOffset: 80,
        includeLine: true
      };
		}

		function buildLibraryTotals () {
			if (!gc.hwLibrary) {
				buildHWLibraryTable(true);
			} else {
				libraryTotals();
			}
		}

		gc.tabClick = function (which) {
			switch(which) {
				case 'GL':
					buildGameLibraryTable();
					break;
				case 'HL':
					buildHWLibraryTable();
					break;
				case 'GW':
					buildGameWishlistTable();
					break;
				case 'HW':
					buildHWWishlist();
					break;
				case 'LT':
					buildLibraryTotals();
			}
		};
	}
]);
