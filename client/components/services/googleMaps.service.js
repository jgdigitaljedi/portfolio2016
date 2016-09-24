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

		function placesElement () {
	        var map = new google.maps.Map(document.getElementById('places-picker'), {
	          center: {lat: 30.260478, lng: -97.736472},
	          zoom: 12
	        });
	        var input = /** @type {!HTMLInputElement} */(
	            document.getElementById('pac-input'));

	        var types = document.getElementById('type-selector');
	        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

	        var autocomplete = new google.maps.places.Autocomplete(input);
	        autocomplete.bindTo('bounds', map);

	        var infowindow = new google.maps.InfoWindow();
	        var marker = new google.maps.Marker({
	          map: map,
	          anchorPoint: new google.maps.Point(0, -29)
	        });

	        autocomplete.addListener('place_changed', function() {
	          infowindow.close();
	          marker.setVisible(false);
	          var place = autocomplete.getPlace();
	          if (!place.geometry) {
	            // window.alert("Autocomplete's returned place contains no geometry");
	            return;
	          }

	          // If the place has a geometry, then present it on a map.
	          if (place.geometry.viewport) {
	            map.fitBounds(place.geometry.viewport);
	          } else {
	            map.setCenter(place.geometry.location);
	            map.setZoom(17);  // Why 17? Because it looks good.
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

	        // Sets a listener on a radio button to change the filter type on Places
	        // Autocomplete.
	        // function setupClickListener(id, types) {
	        //   var radioButton = document.getElementById(id);
	        //   radioButton.addEventListener('click', function() {
	        //     autocomplete.setTypes(types);
	        //   });
	        // }

	        // setupClickListener('changetype-all', []);
	        // setupClickListener('changetype-address', ['address']);
	        // setupClickListener('changetype-establishment', ['establishment']);
	        // setupClickListener('changetype-geocode', ['geocode']);
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
				placesElement();
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