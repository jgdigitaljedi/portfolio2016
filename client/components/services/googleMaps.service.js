'use strict';
/*global google */
/*jshint camelcase: false */

angular.module('portfolioApp').service('Googlemaps', ['$http', '$q', '$rootScope',
	function($http, $q, $rootScope) {
		// I hate having vars like this but Google ain't easy to work with
		var directionsDisplay,
			directionsService,
			gmapsLoaded = false,
			gmapKey,
			directionsMap,
			map,
			firstOptions,
			input,
			autocomplete,
			infowindow,
			steps = {};

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
				console.log('gmaps key error', data);
				def.reject(data);
			});
			return def.promise;
		}

		function placesElement () {
			var center = new google.maps.LatLng(30.260478, -97.736472), // why not downtown Austin? It's moot anyway.
		  		mapOptions = {
		    	zoom: 12,
		    	center: center
		  	};
	        if (!input) {
	        	var inTemp = '<input id="pac-input" class="controls" ng-if="rrrc.mapView === \'manual\'"'+
		        	'placeholder="Enter a location" ng-model="rrrc.manualAddress">',
		        	ele = document.createElement('input'),
		        	el = document.getElementById('map_canvas');
		        ele.innerHTML = inTemp;
		        while (ele.children.length > 0) {
		            el.appendChild(ele.children[0]);
		         }
	        	input = /** @type {!HTMLInputElement} */(
	            	document.getElementById('pac-input'));
	        }
		  	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	        var types = document.getElementById('type-selector');
	        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

	        if (!autocomplete) {
	        	autocomplete = new google.maps.places.Autocomplete(input);
	        }
	        autocomplete.bindTo('bounds', map);

	        infowindow = new google.maps.InfoWindow();
	        var marker = new google.maps.Marker({
	          map: map,
	          anchorPoint: new google.maps.Point(0, -29)
	        });

	        autocomplete.addListener('place_changed', function() {
	          infowindow.close();
	          marker.setVisible(false);
	          var place = autocomplete.getPlace();
	          if (!place.geometry) {
	          	$rootScope.manualAddress = place;
	          	console.log('gonna have to find another way to get this one', $rootScope.manualAddress);
	            return;
	          }

	          // If the place has a geometry, then present it on a map.
	          if (place.geometry.viewport) {
	          	$rootScope.manualPlace = {lat: place.geometry.location.lat(), long: place.geometry.location.lng()};
	            map.fitBounds(place.geometry.viewport);
	          } else {
	            map.setCenter(place.geometry.location);
	            map.setZoom(17);
	          }
	          marker.setIcon(/** @type {google.maps.Icon} */({
	            url: place.icon,
	            size: new google.maps.Size(71, 71),
	            origin: new google.maps.Point(0, 0),
	            anchor: new google.maps.Point(17, 34),
	            scaledSize: new google.maps.Size(35, 35)
	          }));
	          marker.setPosition(place.geometry.location);
	          marker.setVisible(true);

	          var address = '';
	          if (place.address_components) {
	            address = [
	              (place.address_components[0] && place.address_components[0].short_name || ''),
	              (place.address_components[1] && place.address_components[1].short_name || ''),
	              (place.address_components[2] && place.address_components[2].short_name || '')
	            ].join(' ');
	          }

	          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
	          infowindow.open(map, marker);
	        });
		}

		function calcRoute (options) {
		  	var request = {
		    	origin: new google.maps.LatLng(options.origin.lat, options.origin.long),
		    	destination: new google.maps.LatLng(options.dest.lat, options.dest.long),
		    	travelMode: options.travelMode // need to make this changeable eventually
		  	};
		  	directionsService.route(request, function(result, status) {
		    	if (status === 'OK') {
		      		directionsDisplay.setDirections(result);
		      		steps.steps = result.routes[0].legs[0].steps;
		      		steps.duration = result.routes[0].legs[0].duration.text;
		      		$rootScope.$broadcast('directionsStringReady');
		    	}
		  	});
		}

		function dirMap (options) {
			directionsService = new google.maps.DirectionsService();
		  	directionsDisplay = new google.maps.DirectionsRenderer();
		  	var center = new google.maps.LatLng(options.centerLat, options.centerLong),
		  		mapOptions = {
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
				placesElement();
			}
		};

		function loadItUp (which, options) {
			if (!options) options = '';
			if (!gmapsLoaded || !sessionStorage.getItem('gmapKey')) {
				getGmapKey().then(function (key) {
					gmapKey = key;
					loadScript();
					if (which === 'directions') firstOptions = options;
				});
			} else {
				window.initializeGMap(options);
			}
		}

		return {
			generateStaticMap: function (options) {
				options = options.options;
				gmapKey = sessionStorage.getItem('gmapKey');
				directionsMap = true;
				loadItUp('directions', options);
			},
			placesPicker: function () {
				gmapKey = sessionStorage.getItem('gmapKey');
				directionsMap = false;
				loadItUp('places');
			},
			getDirections: function () {
				return steps;
			}
		};
	}
]);