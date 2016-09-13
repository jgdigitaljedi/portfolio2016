'use strict';

angular.module('portfolioApp').controller('ResumeCtrl', ['$window', 'D3Resume', 'Dataobjects', '$rootScope',
	function($window, D3Resume, Dataobjects, $rootScope) {
		var rc = this;
		rc.openFab = false;

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
	}
]);