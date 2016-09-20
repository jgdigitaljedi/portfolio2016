'use strict';

angular.module('portfolioApp').controller('RrrCtrl', ['$scope', '$rootScope', '$http', 'Geolocation',
	function ($scope, $rootScope, $http, Geolocation) {
        var rrrc = this;
        rrrc.theme = $rootScope.theme;

        $rootScope.$on('theme change', function () {
            rrrc.theme = $rootScope.theme;
        });

        rrrc.getCurrentLocation = function () {
        	Geolocation.getCurrentPosition().then(function (data) {
        		console.log('data', data);
        		rrrc.userLocation = {
        			lat: data.location.coords.latitude,
        			long: data.location.coords.longitude
        		}
        	});
        };

        rrrc.manualLocation = function () {
        	// open a modal with a map and have the user click then get coords
        };

        rrrc.callYelp = function () {
			var request = {lat: $rootScope.currentLocale.latitude, long: $rootScope.currentLocale.longitude};
			$http.get('/api/proxy/getyelpinfo/' + loc.lat + '/' + loc.long)
				.success(function (response) {

				})
				.error(function (error) {

				});
			// Yelp.getYelpInfo(request.lat, request.long).then(function (response) {
			// 	console.log('yelp response for future features', response);
			// });
		};
    }
]);