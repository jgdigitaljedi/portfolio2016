'use strict';

angular.module('portfolioApp').controller('AboutCtrl', ['$scope','$rootScope', '$interval',
	function ($scope, $rootScope, $interval) {
		var ac = this,
			photoInt,
			nextIndex;
        ac.showLastfm = true;
        ac.theme = $rootScope.theme;
        ac.photoArr = ['../assets/images/about/meDsShow.jpg', '../assets/images/about/coachingSoccer.jpg',
        	'../assets/images/about/meGuitarShoot.jpg'];
        ac.photo = ac.photoArr[0];
        var paLen = ac.photoArr.length;

        $rootScope.$on('theme change', function () {
            ac.theme = $rootScope.theme;
        });

        (function init () {
        	photoInt = $interval(function () {
        			console.log('interval');
        		ac.photoArr.forEach(function (item, index) {
        			if (ac.photo === item) {
        				if (index + 1 === paLen) {
        					nextIndex = 0;
        					return;
        				} else {
        					nextIndex = index + 1;
        				console.log('ac.photo', ac.photo);
        					return;
        				}
        			}
        		});
        		ac.photo = ac.photoArr[nextIndex];
        	}, 5000);
        })();

        $scope.$on('$destroy', function () {
        	$interval.cancel(photoInt);
        });
	}
]);