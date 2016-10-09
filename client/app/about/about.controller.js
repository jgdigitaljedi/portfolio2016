'use strict';

angular.module('portfolioApp').controller('AboutCtrl', ['$scope','$rootScope', '$interval', 'Dataobjects', '$compile',
	'$timeout', '$http',
	function ($scope, $rootScope, $interval, Dataobjects, $compile, $timeout, $http) {
		var ac = this,
			photoInt,
			nextIndex,
            screenWidth = window.innerWidth;

        ac.gtMd = screenWidth >= 1280 ? true : false;
        ac.showLastfm = true;
        ac.theme = $rootScope.theme;
        ac.photoArr = ['../assets/images/about/meDsShow.jpg', '../assets/images/about/coachingSoccer.jpg',
        	'../assets/images/about/meGuitarShoot.jpg'];
        ac.photo = ac.photoArr[0];
        var paLen = ac.photoArr.length;

        ac.skills = Dataobjects.getSkills();

        $rootScope.$on('theme change', function () {
            ac.theme = $rootScope.theme;
        });

        ac.chartTime = function (which) {
        	ac.currentChart = !which ? ac.skills[0] : ac.skills[which];
        };

        (function init () {
        	photoInt = $interval(function () {
        		ac.photoArr.forEach(function (item, index) {
        			if (ac.photo === item) {
        				if (index + 1 === paLen) {
        					nextIndex = 0;
        					return;
        				} else {
        					nextIndex = index + 1;
        					return;
        				}
        			}
        		});
        		ac.photo = ac.photoArr[nextIndex];
        	}, 5000);
        	$timeout(function () {
        		ac.chartAreaWidth = angular.element(document.getElementById('skills-chart-area')).width();
        	}, 500);
        	ac.chartTime();
            $http.get('/api/proxy/conditions/TX/Manor')
                /*jshint camelcase: false */
                .success(function (response) {
                    console.log('response', response);
                    if (!response.error) {
                        response = response.current_observation;
                        ac.austinTemp = response.temp_f + '°F';
                        ac.weather = response.weather.toLowerCase();                       
                    } else {
                        ac.austinTemp = false;
                    }
                })
                .error(function (error) {
                    console.log('weather error', error);
                    ac.austinTemp = false;
                });
        })();

        $scope.$on('$destroy', function () {
        	$interval.cancel(photoInt);
        });
	}
]);