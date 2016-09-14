'use strict';

angular.module('portfolioApp').controller('ResumeCtrl', ['$window', 'D3Resume', 'Dataobjects', '$rootScope',
	function($window, D3Resume, Dataobjects, $rootScope) {
		console.log('resume controller');
		var rc = this;
		rc.openFab = false;
		rc.theme = $rootScope.theme;

		function colorChartText () {
			var svgText = document.getElementsByTagName('text');
			var tLen = svgText.length;
			for (var i = 0; i < tLen; i++) {
				if (rc.theme === 'day') {
					svgText[i].style.fill = '#212121';
				} else {
					svgText[i].style.fill = '#f1f1f1';					
				}
			}
		}

		rc.downloadResume = function () {
			if (rc.resumeFormat) {
				$window.open('../../assets/resumes/resume2015.' + rc.resumeFormat, '_blank');
			}
		};

		$rootScope.$on('theme change', function () {
		    rc.theme = $rootScope.theme;
		    colorChartText();
		});

		D3Resume.getResumeLogic({
		  	width: window.innerWidth - 40,
		  	height: 420,
		  	wrapperSelector: '#resume',
		  	getItemFillCollor: function (item) {
		  		var colorArr = Dataobjects.getMaterialColors();
		  		return colorArr[Math.floor(Math.random()*48)];
		  	}
		});
		colorChartText();
	}
]);