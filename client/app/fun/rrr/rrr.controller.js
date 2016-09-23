'use strict';

angular.module('portfolioApp').controller('RrrCtrl', ['$scope', '$rootScope', '$http', 'Geolocation', '$state', 'Helpers',
	function ($scope, $rootScope, $http, Geolocation, $state, Helpers) {
        var rrrc = this,
        	distances = {
        		shortWalk: 600, // 7.5 minutes at 80m per minute
        		longWalk: 1200, // 15 minutes
        		shortDrive: 8046, // 5 miles
        		noPreference: 80467 // 50 miles
        	},
        	resultsLen;
        rrrc.showDistOptions = {
        	shortWalk: true,
        	longWalk: true,
        	shortDrive: true,
        	noPreference: true
        };
        rrrc.theme = $rootScope.theme;
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
					var firstDistance = rrrc.restaurantChoices[0].distance;
					var lastDistance = rrrc.restaurantChoices[rrrc.restaurantChoices.length-1].distance;
					if (firstDistance > distances.shortWalk) { // remove smaller distance options if no results match
						rrrc.showDistOptions.shortWalk = false;
					} else if (firstDistance > distances.longWalk) {
						rrrc.showDistOptions.longTalk = false;
					} else if (firstDistance > distances.shortDrive) {
						rrrc.showDistOptions.shortDrive = false;
					}
					if (lastDistance < distances.shortDrive) { // remove larger distance options if no results match
						rrrc.showDistOptions.noPreference = false;
					} else if (lastDistance < distances.longWalk) {
						rrrc.showDistOptions.noPreference = false;
						rrrc.showDistOptions.shortDrive = false;
					} else if (lastDistance < distances.shortWalk) {
						rrrc.showDistOptions.noPreference = false;
						rrrc.showDistOptions.shortDrive = false;
						rrrc.showDistOptions.longWalk = false;
						rrrc.step = 'second';
					}
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
				rChoices = [],
				dupeArr = [];
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
							rrrc.rChoicesNoDupes.push(itm);
							dupeArr.push(itm.id);
						} else if (dupeArr.indexOf(itm.id) === -1) {
							rrrc.rChoicesNoDupes.push(itm);
							dupeArr.push(itm.id);
						}
					});					
				}
			});
			console.log('no dupes', rrrc.rChoicesNoDupes);
			resultsLen = rrrc.rChoicesNoDupes.length;
			if (resultsLen > 1) {
				rrrc.step = 'last';
			} else {
				rrrc.showMeTheMoney();
			}
		};

		function getRandomPlace (first) {
			if (!first) {
				return rrrc.rChoicesNoDupes[Math.floor(Math.random() * resultsLen)];
			}
		}

		function goToResults () {
			console.log('finalAnswer', rrrc.finalAnswer);
			rrrc.step = 'first';
			$state.go('rrr.results');
		}

		rrrc.showMeTheMoney = function () {
			rrrc.finalAnswer = [];
			rrrc.finalAnswer.push(getRandomPlace());
			rrrc.finalAnswer[0].distance = Helpers.distanceConversion(rrrc.finalAnswer[0].distance, 'miles');
			if (rrrc.userChoices === '2') {
				var nextChoice = getRandomPlace();
				while (nextChoice.name === rrrc.finalAnswer[0].name) {
					nextChoice = getRandomPlace();
				}
				nextChoice.distance = Helpers.distanceConversion(nextChoice.distance, 'miles');
				rrrc.finalAnswer.push(nextChoice);
			}
			goToResults();
		};

		rrrc.backToStart = function () {
			$state.go('rrr.main');
		};

		rrrc.backToOptions = function () {
			rrrc.userChoices = false;
			rrrc.step = resultsLen > 1 ? 'last' : 'second';
			$state.go('rrr.options');
		};

		rrrc.selectOptions = function (which) {
			for (var cat in rrrc.selectedCategories) {
				if (cat !== 'list') rrrc.selectedCategories[cat] = which;
			}
			console.log('this shit', rrrc.selectedCategories);
		};
    }
]);