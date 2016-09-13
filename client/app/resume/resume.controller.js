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


		rc.docClicked = function () {
            $window.open('../../assets/resume/resume2015.docx', '_blank');
		};

		rc.pdfClicked = function () {
			$window.open('../../assets/resume/resume2015.pdf', '_blank');
		};

		rc.odtClicked = function () {
			$window.open('../../assets/resume/resume2015.odt', '_blank');
		};

		$rootScope.$on('theme change', function () {
		    rc.theme = $rootScope.theme;
		    colorChartText();
		});

		// var resume = new D3Resume({
		D3Resume.getResumeLogic({
		  	width: window.innerWidth - 40,
		  	height: 420,
		  	wrapperSelector: '#resume',
		  	// dataUrl: 'resume.json',
		  	getItemFillCollor: function (item) {
		  		var colorArr = Dataobjects.getMaterialColors();
		  		return colorArr[Math.floor(Math.random()*48)];
		  	}
		});
		colorChartText();
	}
]);