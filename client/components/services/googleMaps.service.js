'use strict';
/*global google */

angular.module('portfolioApp').factory('Googlemaps', [
	function() {
		return {
			generateStaticMap: function (options) {
				console.log('options', options.options);
				var script = document.createElement('script');
				var directionsDisplay;
				var directionsService;
				var map;

			  	script.type = 'text/javascript';
			  	script.src = 'https://maps.googleapis.com/maps/api/js?key=' + PUT_YOUR_KEY_HERE + '&callback=initializeGMap';
			  	document.body.appendChild(script);

				window.initializeGMap = function () {
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
				  	var request = {
				    	origin: new google.maps.LatLng(options.origin.lat, options.origin.long),
				    	destination: new google.maps.LatLng(options.dest.lat, options.dest.long),
				    	travelMode: 'WALKING'
				  	};
				  	directionsService.route(request, function(result, status) {
				    	if (status == 'OK') {
				      		directionsDisplay.setDirections(result);
				    	}
				  	});
				};

			}
		};
	}
]);