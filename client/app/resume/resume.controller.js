'use strict';

angular.module('portfolioApp').controller('ResumeCtrl', ['$window', 'D3Resume', 'Dataobjects', '$rootScope', '$http',
	function ($window, D3Resume, Dataobjects, $rootScope, $http) {
		// console.log('resume controller');
		var rc = this;
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
      $http({
        method: 'GET',
        url: '/api/proxy/resumepdf',
        params : {},
        headers : {
          'Content-type' : 'application/pdf',
        },
        responseType : 'arraybuffer'
      })
        .then(function (data, status, headers, config) {
          var file = new Blob([ data.data ], {
            type : 'application/pdf'
          });
          //trick to download store a file having its URL
          var fileURL = URL.createObjectURL(file);
          var a         = document.createElement('a');
          a.href        = fileURL;
          a.target      = '_blank';
          a.download    = 'JoeyGauthierResume.pdf';
          document.body.appendChild(a);
          a.click();
        })
        .catch(function(data, status, headers, config) {
          console.log('pdf error', data);
        });
		};

		$rootScope.$on('theme change', function () {
		    rc.theme = $rootScope.theme;
		    colorChartText();
		});

		D3Resume.getResumeLogic({
		  	width: window.innerWidth * 0.8,
		  	height: 600,
		  	wrapperSelector: '#resume',
		  	getItemFillCollor: function (item) {
		  		var colorArr = Dataobjects.getMaterialColors();
		  		return colorArr[Math.floor(Math.random()*48)];
		  	}
		});
		colorChartText();
	}
]);
