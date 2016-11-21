'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('GamesCtrl', ['$rootScope', '$scope', '$http', '$q',
	function ($rootScope, $scope, $http, $q) {
		var gc = this,
			genreObj = {};

		// $rootScope.$on('theme change', function () {
		//     gc.theme = $rootScope.theme;
		// });

		function formatPrice (price) {
			return '$' + price.toFixed(2);
		}

		function getData (which) {
			var def = $q.defer();
			$http.get('/api/proxy/' + which)
				.success(function (data) {
					if (!data.error) {
						def.resolve(data.data);
					} else {
						console.warn('data error', data);
						def.resolve(data.data);
					}
				})
				.error(function (data) {
					console.warn('data error', data);
					def.reject(data);
				});
				return def.promise;
		}

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
				getData('gameslibrary').then(function (response) {
					if (!response.error) {
						// buildGameLibraryTable(response);					
						response.games.forEach(function (item) {
							if (!item.price) {
								item.price = {
									filter: null,
									display: '--'
								};
							} else {
								item.price = {
									filter: item.price,
									display: formatPrice(item.price)
								};
							}
							if (!item.genre) {
								item.genre = '--';
							}

						});
						gc.gameLibrary = response.games;
						glTable();
					} else {
						console.warn('game lib error', response);
					}
				});
			} else {
				if (!($('#game-library-table').hasClass('dataTable'))) {
					glTable();					
				}
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
				getData('hardwarelibrary').then(function (response) {
					response.hardware.forEach(function (item) {
						if (!item.Value) {
							item.Value = {
								filter: null,
								display: '--'
							};
						} else {
							item.Value = {
								filter: item.Value,
								display: formatPrice(item.Value)
							};
						}
						if (!item.Total) {
							item.Total = {
								filter: null,
								display: '--'
							};
						} else {
							item.Total = {
								filter: item.Total,
								display: formatPrice(item.Total)
							};
						}

					});
					gc.hwLibrary = response;
					if (!justGet) hwTable();
				});
			} else {
				if (!($('#hardware-library-table').hasClass('dataTable'))) {
					if (!justGet) hwTable();				
				}
			}
		}

		function gwlTable () {
			$('#games-wishlist-table').DataTable({
				aaData: gc.hwLibrary,
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
				getData('gameswishlist').then(function (response) {
					gc.gamesWl = [];
					for (var key in response) {
						for (var game in response[key]) {
							if (key === 'PS4') {							
							}
							gc.gamesWl.push({
								console: key,
								price: {
									filter: response[key][game].price,
									display: response[key][game].price ? formatPrice(response[key][game].price) : '--'
								},
								cib: {
									filter: response[key][game].price_CIB || '--',
									display: response[key][game].price_CIB ? formatPrice(response[key][game].price_CIB) : '--'
								},
								game: response[key][game].games});
						}
					}
					gwlTable();
				});
			} else {
				if (!($('#games-wishlist-table').hasClass('dataTable'))) {
					gwlTable();				
				}
			}
		}

		function buildHWWishlist () {

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
			// games data fist
			var totalGamePrice = 0,
				gamesCount = 0,
				gamesByConsole = {};
			gc.gameLibrary.forEach(function (item) {
				if (!gamesByConsole.hasOwnProperty(item.platform)) gamesByConsole[item.platform] = [];
				gamesByConsole[item.platform].push({title: item.title, price: item.price});
				totalGamePrice += item.price.filter;
				gamesCount++;
				genreTracker(item.genre);
				// if (!genreObj.hasOwnProperty(item.genre)) {
				// 	genreObj[item.genre] = 1;
				// } else {
				// 	genreObj[item.genre]++;
				// }
			});
			console.log('genre obj', genreObj);
			console.log('totalGamePrice', totalGamePrice);
			console.log('gamesCount', gamesCount);
			console.log('gamesByConsole', gamesByConsole);
		}

		function buildLibraryTotals () {
			if (!gc.hwLibrary) {
				buildHWLibraryTable(true);
			}
			libraryTotals();
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