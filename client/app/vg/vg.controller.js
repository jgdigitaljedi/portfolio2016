'use strict';

angular.module('portfolioApp').controller('GamesCtrl', ['$rootScope', '$scope', '$http', '$q',
	function ($rootScope, $scope, $http, $q) {
		var gc = this;

		$rootScope.$on('theme change', function () {
		    gc.theme = $rootScope.theme;
		});

		function formatPrice (price) {
			return '$' + price.toFixed(2);
		}

		function getData (which) {
			var def = $q.defer();
			$http.get('/api/proxy/' + which)
				.success(function (data) {
					if (!data.error) {
						console.log('data', data.data);
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
			console.log('hw table', gc.hwLibrary);
			// var table = $('#hardware-library-table').dataTable();
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

		function buildHWLibraryTable () {
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
					hwTable();
				});
			} else {
				if (!($('#hardware-library-table').hasClass('dataTable'))) {
					hwTable();				
				}
			}
		}

		function buildGameWishlistTable () {

		}

		function buildHWWishlist () {

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
			}
		};
	}

]);