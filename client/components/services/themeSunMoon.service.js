'use strict';
/*jshint camelcase: false */
/*global moment: false */

angular.module('portfolioApp').factory('SunMoon', ['$rootScope', '$http',
  function ($rootScope, $http) {
    return {
      getSunMoonData: function () {
        var today = moment().format('MM/DD/YYYY'),
          sunTimes = {sunrise: '', sunset: '', hours: {rise: '', sset: ''}, moon: {}},
          dateFormat = 'MM/DD/YYYY HH:mm';

        function setThemeAndSunTimes(sunTimes) {
          $rootScope.sunTimes = sunTimes;
          console.log('sunrise', today + sunTimes.sunrise);
          console.log('sunset', today + sunTimes.sunset);
          if (moment().isBefore(today + sunTimes.sunrise, dateFormat) || moment().isAfter(today + sunTimes.sunset, dateFormat)) {
            console.log('setting night');
            $rootScope.theme = 'night';
            console.log('night');
          } else {
            console.log('setting day');
            $rootScope.theme = 'day';
          }
          // $rootScope.theme = $scope.theme;
          $rootScope.$broadcast('theme set');
        }

        function fixSunTimes(hour, minute) {
          hour = hour.toString();
          if (hour.length === 1) hour = '0' + hour;
          return ' ' + hour + ':' + minute;
        }

        $http.get('/api/proxy/astronomy/TX/Manor')
        /*jshint camelcase: false */
        .then(function (response) {
          if (!response.error) {
            var sun = response.data.sun_phase;
            sunTimes.hours.rise = sun.sunrise.hour;
            sunTimes.hours.sset = sun.sunset.hour;
            sunTimes.sunrise = fixSunTimes(sun.sunrise.hour, sun.sunrise.minute);
            sunTimes.sunset = fixSunTimes(sun.sunset.hour, sun.sunset.minute);
            sunTimes.moon = response.data.moon_phase;
          } else {
            sunTimes.hours.rise = '07';
            sunTimes.hours.sset = '19';
            sunTimes.sunrise = ' 07:00';
            sunTimes.sunset = ' 19:00';
            sunTimes.moon = false;
          }
          setThemeAndSunTimes(sunTimes);
        })
        .catch(function (error) {
          console.log('astronomy error', error);
          sunTimes.hours.rise = '07';
          sunTimes.hours.sset = '19';
          sunTimes.sunrise = ' 07:00';
          sunTimes.sunset = ' 19:00';
          sunTimes.moon = false;
          setThemeAndSunTimes(sunTimes);
        });
      }
    };
  }
]);
