'use strict';

angular.module('portfolioApp').controller('SocialCtrl', ['$scope', '$rootScope', '$http', '$window',
	function ($scope, $rootScope, $http, $window) {
		var sc = this;
        sc.music = {
        	artists: [],
        	tracks: []
        };
        sc.state = {
        	music: {
        		artists: {
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
            sc.theme = $rootScope.theme;
        });

        sc.openMusicLink = function (url) {
        	$window.open(url, '__blank');
        };

    	$http.get('/api/proxy/lastfmweeklyartists')
    		.success(function (data) {
    			data = data.weeklyartistchart.artist;
    			if (!data.error) {
    				for (var i = 0; i < 5; i++) {
    					sc.music.artists.push({name: data[i].name, url: data[i].url, count: data[i].playcount});
    				}
    				sc.state.music.artists.error = false;
    			} else {
    				sc.state.music.artists.error = true;    				
    			}
    			sc.state.music.artists.loaded = true;
    		})
    		.error(function (error) {
    			console.log('error', error);
    			sc.state.music.artists.loaded = true;
    			sc.state.music.artists.error = true;
    		}
    	);

		$http.get('/api/proxy/lastfmweeklytracks')
			.success(function (data) {
				console.log('data', data);
				data = data.weeklytrackchart.track;
				if (!data.error) {
					for (var i = 0; i < 5; i++) {
						sc.music.tracks.push(
							{
								name: data[i].name,
								artist: data[i].artist['#text'],
								count: data[i].playcount,
								url: data[i].url
							}
						);
					}
    				sc.state.music.tracks.error = false;
				} else {
    				sc.state.music.tracks.error = true;
				}
				sc.state.music.tracks.loaded = true;
			})
			.error(function (error) {
				console.log('error', error);
				sc.state.music.tracks.loaded = true;
    			sc.state.music.tracks.error = true;
			}
		);
	}
]);