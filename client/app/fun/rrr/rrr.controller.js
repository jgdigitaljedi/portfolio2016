'use strict';

angular.module('portfolioApp').controller('RrrCtrl', ['$scope', '$rootScope', '$http', 'Geolocation', '$state',
	function ($scope, $rootScope, $http, Geolocation, $state) {
        var rrrc = this,
        	distances = {
        		shortWalk: 600, // 7.5 minutes at 80m per minute
        		longWalk: 1200, // 15 minutes
        		shortDrive: 8046, // 5 miles
        		noPreference: 80467 // 50 miles
        	},
        	resultsLen;
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
        		rrrc.step = 'first';
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
				rrrc.selectedCategories = {list: []};
				var limit = distances[choice];
				rrrc.restaurantChoices.forEach(function (item) {
					if (item.distance <= limit) {
						rrrc.filteredChoices.push(item);
						if (item.categories.length > 0) {
							item.categories.forEach(function (ite) {
								if (rrrc.categories.length === 0) {
									rrrc.categories.push(ite[0]);
									rrrc.selectedCategories[ite[0]] = false;
									if (!rrrc.selectedCategories.list[ite[0]]) {
										rrrc.selectedCategories.list[ite[0]] = [];
									}
								}
								if (rrrc.categories.indexOf(ite[0]) === -1) {
									rrrc.categories.push(ite[0]);
									rrrc.selectedCategories[ite[0]] = false;
									if (!rrrc.selectedCategories.list[ite[0]]) {
										rrrc.selectedCategories.list[ite[0]] = [];
									}
								}
								rrrc.selectedCategories.list[ite[0]].push(item);
							});
						}
					}
				});
				rrrc.step = 'second';	
			}
		};

		rrrc.doneWithCats = function () {
			console.log('rrrc.selectedCategories', rrrc.selectedCategories);
			var catArr = [],
				rChoices = [];
			rrrc.rChoicesNoDupes = [];
			for (var cat in rrrc.selectedCategories) {
				if (rrrc.selectedCategories[cat]) {
					catArr.push(cat);
				}
			}
			console.log('catArr', catArr);
			catArr.forEach(function (item) {
				rChoices.push(rrrc.selectedCategories.list[item]);
			});
			console.log('rChoices', rChoices);
			rChoices.forEach(function (item) {
				if (item && item.length > 0) {
					item.forEach(function (itm) {
						if (rrrc.rChoicesNoDupes.length === 0) {
							rrrc.rChoicesNoDupes.push({[itm.id]: itm});
						} else if (!rrrc.rChoicesNoDupes.hasOwnProperty(item.id)) {
							rrrc.rChoicesNoDupes.push({[itm.id]: itm});
						}
					});					
				}
			});
			console.log('no dupes', rrrc.rChoicesNoDupes);
			resultsLen = rrrc.rChoicesNoDupes.length;
			rrrc.step = 'last';
		};

		function getRandomPlace (first) {
			if (!first) {
				return rrrc.rChoicesNoDupes[Math.floor(Math.random() * resultsLen)];
			}
		}

		rrrc.showMeTheMoney = function () {
			rrrc.finalAnswer = [];
			if (rrrc.finalAnswer.length === 0) {
				rrrc.finalAnswer.push(getRandomPlace());
			}
			// if (rrrc.userChoices === 2) {
			// 	var nextChoice = getRandomPlace();
			// 	if 
			// }
		};
    }
]);