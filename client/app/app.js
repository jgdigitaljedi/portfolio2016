'use strict';

angular.module('portfolioApp', [
    'ngMaterial',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'angulike'
]).config(function($mdIconProvider) {
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
}).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
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
}).controller('AppCtrl', function ($scope, $rootScope) {
    var theHour = parseInt(moment().format('HH'));
    $scope.theme = (theHour >= 7 && theHour < 19) ? 'day' : 'night';
    $rootScope.theme = $scope.theme;

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
