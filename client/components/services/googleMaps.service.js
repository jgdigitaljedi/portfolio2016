'use strict';
/*global google */

angular.module('portfolioApp').service('Googlemaps', ['$http', '$q',
	function($http, $q) {
		var directionsDisplay;
		var directionsService;
		var gmapsLoaded = false;

		return {
			generateStaticMap: function (options) {
				var gmapKey = sessionStorage.getItem('gmapKey');
				var map;
				options = options.options;

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

				function loadScript () {
					if (!gmapsLoaded) {
						var script = document.createElement('script');
					  	script.type = 'text/javascript';
					  	script.src = 'https://maps.googleapis.com/maps/api/js?key=' + gmapKey + '&callback=initializeGMap';
					  	document.body.appendChild(script);						
					}
				}

				if (!gmapsLoaded || !sessionStorage.getItem('gmapKey')) {
					getGmapKey().then(function (key) {
						gmapKey = key;
						loadScript();
					});
				} else {
					window.initializeGMap();
				}

				window.initializeGMap = function () {
					gmapsLoaded = true;
					directionsService = new google.maps.DirectionsService();
				  	directionsDisplay = new google.maps.DirectionsRenderer();
				  	var center = new google.maps.LatLng(options.centerLat, options.centerLong);
				  	var mapOptions = {
				    	zoom: options.zoom,
				    	center: center
				  	};
				  	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
				  	directionsDisplay.setMap(map);
				  	window.calcRoute();
				};

				window.calcRoute = function () {
					console.log('options', options);
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
				};
			}
		};
	}
]);