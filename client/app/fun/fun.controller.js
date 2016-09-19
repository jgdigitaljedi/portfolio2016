'use strict';

angular.module('portfolioApp').controller('FunCtrl', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
        var fc = this;
        fc.theme = $rootScope.theme;
        fc.music = {};

        $rootScope.$on('theme change', function () {
            fc.theme = $rootScope.theme;
        });

        function getTopFive (data, param) {
        	var result = [];
        	for (var i = 0; i < 5; i++) {
        		result.push({[param]: data[param], url: data.url});
        	}
        	return result;
        }

        (function init () {
        	// $http.get('/api/proxy/conditions/TX/Manor')
        	// 	.success(function (response) {
        	// 		console.log('response', response);
        	// 		response = response.current_observation;
        	// 		fc.austinTemp = response.temp_f + ' F';
        	// 		fc.austinIcon = '../assets/images/' + response.icon + '.png';
        	// 	})
        	// 	.error(function (error) {
        	// 		console.log('weather error', error);
        	// 	});

        	$http.get('/api/proxy/lastfmweeklyartists')
        		.success(function (data) {
        			console.log('data', data);
        			if (!data.error) {
        				fc.music.artists = getTopFive(data.artist, 'name');
        			}
        		})
        		.error(function (error) {
        			console.log('error', error);
        		});
        })();

    }
]);