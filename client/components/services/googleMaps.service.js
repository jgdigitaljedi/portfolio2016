'use strict';
/*global google */

angular.module('portfolioApp').factory('Googlemaps', [
	function() {
		return {
			generateStaticMap: function (options) {
				window.initializeGMap = function() {
				  	var mapOptions = {
					    zoom: options.zoom || 12,
					    center: new google.maps.LatLng(options.coords),
					    scrollwheel: options.scroll || false,
					    navigationControl: options.navControl || false,
					    mapTypeControl: options.typeControl || false,
					    scaleControl: options.scaleControl || false,
					    zoomControl: options.zoomControl || false,
					    draggable: options.draggable || false
					};

					var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
					    trafficLayer = new google.maps.TrafficLayer();
					  	trafficLayer.setMap(map);
				};

				var script = document.createElement('script');
			  	script.type = 'text/javascript';
			  	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
			      	'&signed_in=true&callback=initializeGMap';
			  	document.body.appendChild(script);
			}
		};
	}
]);