'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('GamesCtrl', ['$rootScope', '$scope', '$http',
	function ($rootScope, $scope, $http) {
		var gc = this;

		$rootScope.$on('theme change', function () {
		    gc.theme = $rootScope.theme;
		});

		function formatPrice (price) {
			return '$' + price.toFixed(2);
		}

		function buildGameLibraryTable (games) {
			games.games.forEach(function (item) {
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
			$('#game-library-table').DataTable({
				aaData: games.games,
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

		(function () {
			$http.get('/api/proxy/gameslibrary/')
				.success(function (data, status, headers, config) {
					if (!data.error) {
						console.log('game library', data.data);
						gc.gamelibrary = data.games;
						buildGameLibraryTable(data.data);
					} else {
						console.warn('game library error', data);
					}
				})
				.error(function (data, status, headers, config) {
					console.warn('game library error', data);
				});

		})();
	}
]);