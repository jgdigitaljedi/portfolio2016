'use strict';

angular.module('portfolioApp').controller('AboutCtrl', ['$scope','$rootScope', '$interval', 'Dataobjects', '$compile',
	'$timeout',
	function ($scope, $rootScope, $interval, Dataobjects, $compile, $timeout) {
		var ac = this,
			photoInt,
			nextIndex,
			currChart,
			chartAreaWidth;
        ac.showLastfm = true;
        ac.theme = $rootScope.theme;
        ac.photoArr = ['../assets/images/about/meDsShow.jpg', '../assets/images/about/coachingSoccer.jpg',
        	'../assets/images/about/meGuitarShoot.jpg'];
        ac.photo = ac.photoArr[0];
        var paLen = ac.photoArr.length;

        ac.skills = Dataobjects.getSkills();
        console.log('chartAreaWidth', ac.chartAreaWidth);

        $rootScope.$on('theme change', function () {
            ac.theme = $rootScope.theme;
        });

        function chartTime (which) {
        	if (!which) currChart = ac.skills[0];
        	var template = '',
        		colors = Dataobjects.getMaterialColors(),
        		cLen = colors.length,
        		skillsLen = currChart.skillList.length,
        		barWidth = chartAreaWidth / ((skillsLen*2) + 1);
        	console.log('bar width is ' + barWidth + ' and skillsLen is ' + skillsLen + ' and chart area is ' + chartAreaWidth);
        	currChart.skillList.forEach(function (item) {
        		template += '<div class="chart-bar" style="background-color: '+
        						colors[Math.floor(Math.random() * cLen) + 1] +'; height: ' + 320 * (item.rating / 100) +
        						'px; width: ' + barWidth + 'px;" layout="column">'+
        					'</div>';

        	});
        	angular.element(document.getElementById('custom-chartish-thing')).html($compile(template)($scope));
        }

        (function init () {
        	photoInt = $interval(function () {
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
        	$timeout(function () {
        		chartAreaWidth = angular.element(document.getElementById('custom-chartish-thing')).width();
        		chartTime();
        	}, 500);
        })();

        $scope.$on('$destroy', function () {
        	$interval.cancel(photoInt);
        });
	}
]);