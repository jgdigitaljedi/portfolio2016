'use strict';
/*global moment: false */

angular.module('portfolioApp').service('Yelp', ['$q', '$http',
	function ($q, $http) {


		return {
			getYelpInfo: function (lat, long) {
				var def = $q.defer();
				$http.get('/getYelpInfo/' + lat + '/' + long)
					.success(function (data, status, headers, config) {
						def.resolve(JSON.parse(data.content));
					})
					.error(function (data, status, headers, config) {
						def.reject({error: true});
					});
				return def.promise;
			}
		};
	}
]);