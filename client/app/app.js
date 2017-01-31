'use strict()';

angular.module('portfolioApp', [
    'ngMaterial',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'angulike'
]).config(function ($mdIconProvider, $stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $mdIconProvider
        .iconSet('action', '../assets/iconsets/action-icons.svg', 24)
        .iconSet('alert', '../assets/iconsets/alert-icons.svg', 24)
        .iconSet('av', '../assets/iconsets/av-icons.svg', 24)
        .iconSet('communication', '../assets/iconsets/communication-icons.svg', 24)
        .iconSet('content', '../assets/iconsets/content-icons.svg', 24)
        .iconSet('device', '../assets/iconsets/device-icons.svg', 24)
        .iconSet('editor', '../assets/iconsets/editor-icons.svg', 24)
        .iconSet('file', '../assets/iconsets/file-icons.svg', 24)
        .iconSet('hardware', '../assets/iconsets/hardware-icons.svg', 24)
        .iconSet('icons', '../assets/iconsets/icons-icons.svg', 24)
        .iconSet('image', '../assets/iconsets/image-icons.svg', 24)
        .iconSet('maps', '../assets/iconsets/maps-icons.svg', 24)
        .iconSet('navigation', '../assets/iconsets/navigation-icons.svg', 24)
        .iconSet('notification', '../assets/iconsets/notification-icons.svg', 24)
        .iconSet('social', '../assets/iconsets/social-icons.svg', 24)
        .iconSet('toggle', '../assets/iconsets/toggle-icons.svg', 24)
        .iconSet('avatar', '../assets/iconsets/avatar-icons.svg', 128);

    $urlRouterProvider
        .otherwise('/');

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('night')
        .primaryPalette('blue-grey')
        .accentPalette('amber')
        .warnPalette('red')
        .dark();

    $mdThemingProvider.theme('day')
        .primaryPalette('blue-grey')
        .accentPalette('amber')
        .warnPalette('red');

    $mdThemingProvider.alwaysWatchTheme(true);
    $mdThemingProvider.enableBrowserColor({theme: 'night'});
}).controller('AppCtrl', function ($scope, $state, SunMoon, $rootScope) {
  SunMoon.getSunMoonData();
  // $scope.theme = 'day'; // backup selection in case something goes wrong
  $rootScope.$on('theme set', function () {
    $scope.theme = $rootScope.theme || 'day';

  });
    // $rootScope.$on('$stateChangeSuccess', function () {
    //   $rootScope.title = $state.current.title;
    // });

    // var today = moment().format('MM/DD/YYYY'),
    //   sunTimes = {sunrise: '', sunset: '', hours: {rise: '', sset: ''}, moon: {}},
    //   dateFormat = 'MM/DD/YYYY HH:mm';
    //
    // function setThemeAndSunTimes (sunTimes) {
    //   $rootScope.sunTimes = sunTimes;
    //   console.log('sunrise', today + sunTimes.sunrise);
    //   console.log('sunset', today + sunTimes.sunset);
    //   console.log('now', moment());
    //   console.log('dateFormat', dateFormat);
    //   if (moment().isBefore(today + sunTimes.sunrise, dateFormat) || moment().isAfter(today + sunTimes.sunset, dateFormat)) {
    //     $scope.theme = 'night';
    //     console.log('night');
    //   } else {
    //     $scope.theme = 'day';
    //   }
    //   $rootScope.theme = $scope.theme;
    //   $rootScope.$broadcast('theme set');
    // }
    //
    // function fixSunTimes (hour, minute) {
    //   hour = hour.toString();
    //   if (hour.length === 1) hour = '0' + hour;
    //   return ' ' + hour + ':' + minute;
    // }
    //
    // $http.get('/api/proxy/astronomy/TX/Manor')
    // /*jshint camelcase: false */
    // .then(function (response) {
    //   if (!response.error) {
    //     var sun = response.data.sun_phase;
    //     sunTimes.hours.rise = sun.sunrise.hour;
    //     sunTimes.hours.sset = sun.sunset.hour;
    //     sunTimes.sunrise = fixSunTimes(sun.sunrise.hour, sun.sunrise.minute);
    //     sunTimes.sunset = fixSunTimes(sun.sunset.hour, sun.sunset.minute);
    //     sunTimes.moon = response.data.moon_phase;
    //   } else {
    //     sunTimes.hours.rise = '07';
    //     sunTimes.hours.sset = '19';
    //     sunTimes.sunrise = ' 07:00';
    //     sunTimes.sunset = ' 19:00';
    //     sunTimes.moon = false;
    //   }
    //   setThemeAndSunTimes(sunTimes);
    // })
    // .catch(function (error) {
    //   console.log('astronomy error', error);
    //   sunTimes.hours.rise = '07';
    //   sunTimes.hours.sset = '19';
    //   sunTimes.sunrise = ' 07:00';
    //   sunTimes.sunset = ' 19:00';
    //   sunTimes.moon = false;
    //   setThemeAndSunTimes(sunTimes);
    // });


  // konami code
    var neededkeys = [38,38,40,40,37,39,37,39,66,65],
        started = false,
        count = 0;
    function reset() {
        started = false; count = 0;
        return;
    }
    $(document).keydown(function (e){
        var key = e.keyCode;
        //Set start to true only if having pressed the first key in the konami sequence.
        if (!started){
            if (key === 38){
                started = true;
            }
        }
        //If we've started, pay attention to key presses, looking for right sequence.
        if (started){
            if (neededkeys[count] === key){
                //We're good so far.
                count++;
            } else {
                //Oops, not the right sequence, lets restart from the top.
                reset();
            }
            if (count === 10){
                //We made it! Do something cool here.
                // audio.play();
              console.log('konami code');
                $scope.konami = true;
                //Reset the conditions so that someone can do it all again.
                reset();
            }
        } else {
        //Oops.
            reset();
        }
    });
    //Function used to reset us back to starting point.
});
