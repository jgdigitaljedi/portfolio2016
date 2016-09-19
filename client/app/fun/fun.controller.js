'use strict';

angular.module('portfolioApp').controller('FunCtrl', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {
        var fc = this;
        fc.theme = $rootScope.theme;
        fc.music = {
        	artists: [],
        	tracks: []
        };
        fc.state = {
        	weather: {
        		loaded: false,
        		error: false
        	},
        	music: {
        		arists: {
        			loaded: false,
        			error: false
        		},
        		tracks: {
        			loaded: false,
        			error: false
        		}
        	}
        };

        $rootScope.$on('theme change', function () {
            fc.theme = $rootScope.theme;
        });

        fc.openMusicLink = function (url) {
        	$window.open(url, '__blank');
        };

    	$http.get('/api/proxy/conditions/TX/Manor')
    		.success(function (response) {
    			response = response.current_observation;
    			fc.austinTemp = response.temp_f + ' F';
    			fc.austinIcon = '../assets/images/' + response.icon + '.png';
    			fc.state.weather.loaded = true;
    			fc.state.weather.error = false;
    		})
    		.error(function (error) {
    			console.log('weather error', error);
    			fc.state.weather.loaded = true;
    			fc.state.weather.error = true;
    		});

    	$http.get('/api/proxy/lastfmweeklyartists')
    		.success(function (data) {
    			data = data.weeklyartistchart.artist;
    			if (!data.error) {
    				for (var i = 0; i < 5; i++) {
    					fc.music.artists.push({name: data[i].name, url: data[i].url, count: data[i].playcount});
    				}
    				fc.state.music.artists.error = false;
    			} else {
    				fc.state.music.artists.error = true;    				
    			}
    			fc.state.music.artists.loaded = true;
    		})
    		.error(function (error) {
    			console.log('error', error);
    			fc.state.music.artists.loaded = true;
    			fc.state.music.artists.error = true;
    		});

		$http.get('/api/proxy/lastfmweeklytracks')
			.success(function (data) {
				console.log('data', data);
				data = data.weeklytrackchart.track;
				if (!data.error) {
					for (var i = 0; i < 5; i++) {
						fc.music.tracks.push(
							{
								name: data[i].name,
								artist: data[i].artist['#text'],
								count: data[i].playcount,
								url: data[i].url
							}
						);
					}
    				fc.state.music.tracks.error = false;
				} else {
    				fc.state.music.tracks.error = true;
				}
				fc.state.music.tracks.loaded = true;
			})
			.error(function (error) {
				console.log('error', error);
				fc.state.music.tracks.loaded = true;
    			fc.state.music.tracks.error = true;
			});

    }
]);