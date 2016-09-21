'use strict';

angular.module('portfolioApp').controller('RrrCtrl', ['$scope', '$rootScope', '$http', 'Geolocation', '$state',
	function ($scope, $rootScope, $http, Geolocation, $state) {
        var rrrc = this;
        rrrc.theme = $rootScope.theme;
        console.log('state', $state.current);
        if ($state.current.name === 'rrr') {
        	$state.go('rrr.main');
        }

        $rootScope.$on('theme change', function () {
            rrrc.theme = $rootScope.theme;
        });

        rrrc.getCurrentLocation = function () {
        	Geolocation.getCurrentPosition().then(function (data) {
        		callYelp(data.location.coords.latitude, data.location.coords.longitude);
        		$state.go('rrr.options');
        	});
        };

        rrrc.manualLocation = function () {
        	// route with a map and have the user click then get coords
        };

        function callYelp (uLat, uLong) {
			$http.get('/api/proxy/getyelpinfo/' + uLat + '/' + uLong)
				.success(function (response) {
					rrrc.restaurantChoices = JSON.parse(response.content);
					console.log('response', rrrc.restaurantChoices);
				})
				.error(function (error) {
					console.log('yelp error', error);
				});
		}
    }
]);