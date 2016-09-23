'use strict';
/*global google */

angular.module('portfolioApp').factory('Googlemaps', [
	function() {
		return {
			generateStaticMap: function (options) {
				console.log('options', options.options);
				options = options.options;
				// var map;
				// window.initializeGMap = function (directions) {
				//   	var mapOptions = {
				// 	    zoom: options.zoom || 12,
				// 	    center: new google.maps.LatLng(options.centerLat, options.centerLong),
				// 	    scrollwheel: options.scroll || false,
				// 	    navigationControl: options.navControl || false,
				// 	    mapTypeControl: options.typeControl || false,
				// 	    scaleControl: options.scaleControl || false,
				// 	    zoomControl: options.zoomControl || false,
				// 	    draggable: options.draggable || false
				// 	};

				// 	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
				//     trafficLayer = new google.maps.TrafficLayer();
				//   	trafficLayer.setMap(map);
				//   	if (directions) window.calcRoute()
				// };

				// window.calcRoute = function () {
				// 	var directionsDisplay;
				// 	var directionsService = new google.maps.DirectionsService();
				// 	var destination = new google.maps.LatLng(options.dest.lat, options.dest.long);
				// 	var origin = new google.maps.LatLng(options.origin.lat, options.origin.long);
				// 	// var selectedMode = document.getElementById('mode').value;
				// 	var request = {
				// 	    origin: origin,
				// 	    destination: destination,
				// 	    travelMode: google.maps.TravelMode['WALKING']
				// 	};
				//     directionsService.route(request, function(response, status) {
				//     	if (status == 'OK') {
				//       		directionsDisplay.setDirections(response);
				//     	}
				//   	});
				// };
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