'use strict';

angular.module('portfolioApp').controller('RrrCtrl', ['$scope', '$rootScope', '$http', 'Geolocation', '$state',
	function ($scope, $rootScope, $http, Geolocation, $state) {
        var rrrc = this,
        	distances = {
        		shortWalk: 600, // 7.5 minutes at 80m per minute
        		longWalk: 1200, // 15 minutes
        		shortDrive: 8046, // 5 miles
        		noPreference: 80467 // 50 miles
        	};
        rrrc.theme = $rootScope.theme;
        console.log('state', $state.current);
        if ($state.current.name === 'rrr') {
        	$state.go('rrr.main');
        }

        $rootScope.$on('theme change', function () {
            rrrc.theme = $rootScope.theme;
        });

        function callYelp (uLat, uLong) {
			$http.get('/api/proxy/getyelpinfo/' + uLat + '/' + uLong)
				.success(function (response) {
					response = JSON.parse(response.content);
					rrrc.restaurantChoices = response.businesses;
					console.log('response', rrrc.restaurantChoices);
				})
				.error(function (error) {
					console.log('yelp error', error);
				});
		}

        rrrc.getCurrentLocation = function () {
        	Geolocation.getCurrentPosition().then(function (data) {
        		callYelp(data.location.coords.latitude, data.location.coords.longitude);
        		$state.go('rrr.options');
        	});
        };

        rrrc.manualLocation = function () {
        	// route with a map and have the user click then get coords
        };

		rrrc.filterDistance = function (choice) {
			console.log('choice', choice);
			if (choice) {
				rrrc.filteredChoices = [];
				rrrc.categories = [];
				rrrc.selectedCategories = {};
				var limit = distances[choice];
				rrrc.restaurantChoices.forEach(function (item) {
					if (item.distance <= limit) {
						rrrc.filteredChoices.push(item);
						if (item.categories.length > 0) {
							item.categories.forEach(function (ite, idx) {
								console.log('cat', rrrc.categories.indexOf(ite));
								if (rrrc.categories.length === 0) {
									rrrc.categories.push(ite[0])
									rrrc.selectedCategories[ite] = false;
								}
								if (rrrc.categories.indexOf(ite[0]) === -1) {
									rrrc.categories.push(ite[0]);
									rrrc.selectedCategories[ite] = false;
								}
							});
						}
					}
				});
				console.log('categories', rrrc.categories);
				console.log('distance choices', rrrc.filteredChoices);
				rrrc.showStep2 = true;		
			}
		};

		rrrc.doneWithCats = function () {
			var catArr = [];
			for (var cat in rrrc.selectedCategories) {
				if (rrrc.selectedCategories[cat]) {
					catArr.push(cat);
				}
			}
			console.log('catArr', catArr);
			// rrrc.filteredChoices.forEach(function (item) {

			// });
			console.log('rrrc.selectedCategories', rrrc.selectedCategories);
		};

		rrrc.showMeTheMoney = function () {
			console.log('send pressed');
		};
    }
]);