'use strict';
/*global google */

angular.module('portfolioApp').service('Googlemaps', ['$http', '$q',
	function($http, $q) {
		// I hate having vars like this but Google ain't easy to work with
		var directionsDisplay;
		var directionsService;
		var gmapsLoaded = false;
		var gmapKey;
		var directionsMap;
		var map;
		var firstOptions;

		function loadScript () {
			if (!gmapsLoaded) {
				var script = document.createElement('script');
			  	script.type = 'text/javascript';
			  	script.src = 'https://maps.googleapis.com/maps/api/js?key=' + gmapKey +
			  		'&libraries=places&callback=initializeGMap';
			  	document.body.appendChild(script);						
			}
		}

		function getGmapKey () {
			var def = $q.defer();
			$http.get('/api/proxy/getgmapkey')
			.success(function (data) {
				gmapKey = data;
				sessionStorage.setItem('gmapKey', gmapKey);
				def.resolve(gmapKey);
			})
			.error(function (data) {
				console.log('gmaps error', data);
				def.reject(data);
			});
			return def.promise;
		}

		function calcRoute (options) {
			console.log('calc options', options);
		  	var request = {
		    	origin: new google.maps.LatLng(options.origin.lat, options.origin.long),
		    	destination: new google.maps.LatLng(options.dest.lat, options.dest.long),
		    	travelMode: 'WALKING'
		  	};
		  	directionsService.route(request, function(result, status) {
		    	if (status === 'OK') {
		      		directionsDisplay.setDirections(result);
		    	}
		  	});
		}

		function dirMap (options) {
			directionsService = new google.maps.DirectionsService();
		  	directionsDisplay = new google.maps.DirectionsRenderer();
		  	var center = new google.maps.LatLng(options.centerLat, options.centerLong);
		  	var mapOptions = {
		    	zoom: options.zoom,
		    	center: center
		  	};
		  	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
		  	directionsDisplay.setMap(map);
		  	calcRoute(options);				
		}

		window.initializeGMap = function (options) {
			gmapsLoaded = true;
			if (directionsMap) {
				if (options) {
					dirMap(options);
				} else {
					dirMap(firstOptions);
				}
			} else {
				console.log('places picker');
			}
		};

		return {
			generateStaticMap: function (options) {
				options = options.options;
				gmapKey = sessionStorage.getItem('gmapKey');
				directionsMap = true;

				if (!gmapsLoaded || !sessionStorage.getItem('gmapKey')) {
					getGmapKey().then(function (key) {
						gmapKey = key;
						loadScript();
						firstOptions = options;
					});
				} else {
					window.initializeGMap(options);
				}

			},
			placesPicker: function () {
				gmapKey = sessionStorage.getItem('gmapKey');
				directionsMap = false;
				// var pMap;

				if (!gmapsLoaded || !sessionStorage.getItem('gmapKey')) {
					getGmapKey().then(function (key) {
						gmapKey = key;
						loadScript();
					});
				} else {
					window.initializeGMap();
				}
			}
		};
	}
]);