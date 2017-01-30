'use strict';

angular.module('portfolioApp')
    .controller('MainCtrl', function ($scope, $http, $compile, $rootScope, $timeout) {
        var mainVm = this;
        mainVm.showLastfm = true;
        mainVm.theme = $rootScope.theme || 'day';

        $rootScope.$on('theme change', function () {
            mainVm.theme = $rootScope.theme;
            mainVm.todImage = mainVm.theme === 'day' ? 'sun.png' : 'moon.png';
        });

        var descArr = ['Disc golfer, guitar player, Raspberry Pi tinkerer, & bearded gentleman.',
          'Extreme allergy sufferer, video game collector, Android fanboy, & dog person.',
          'Clean freak, craft beer snob, total Linux geek, & all-around good guy.',
          'Music snob, casual Dallas Cowboys fan, & has a complete lack of fashion sense.',
          'My wife calls me both a hipster and a robot. That does not compute with me.'];

        mainVm.description = descArr[Math.floor((Math.random() * descArr.length))];

        function makeLastFmWidget(result) {
            for(var i = 0; i < 5; i++) {
                var artistWeb = result[i].artist['#text'].split(' ').join('+'),
                    nameWeb = result[i].name.split(' ').join('+'),
                    ytUrl = 'https://www.youtube.com/results?search_query=' + artistWeb + '-' + nameWeb,
                    albumImage = result[i].image[1]['#text'] ? result[i].image[1]['#text'] : '../../../assets/images/no-image.png',
                    template = $compile('<a href="' + ytUrl + '" target=\'__blank\'><img src="' + albumImage +
                        '" class="song-image"/><md-tooltip style="color: #ffc107;">' + result[i].artist['#text'] + ' / ' + result[i].name +
                        '</md-tooltip></a>')($scope);
                    angular.element( document.querySelector('#lastfm-widget')).append(template);
                    //if (result[i].image[1]['#text']) {
                    //    albumImage = result[i].image[1]['#text'];
                    //    var template = $compile('<a href="' + ytUrl + '" target=\'__blank\'><img src="' + result[i].image[1]['#text'] +
                    //        '" class="song-image"/><md-tooltip style="color: black;">' + result[i].artist['#text'] + ' / ' + result[i].name +
                    //        '</md-tooltip></a>')($scope);
                    //    angular.element( document.querySelector('#lastfm-widget')).append(template);
                    //} else {
                    //    $http.get('/lastart/' + result[i].artist['#text']).then( function successCallback (response) {
                    //        console.log('response', response.data.results.artistmatches.artist[0].image[1]['#text']);
                    //        albumImage = response.data.results.artistmatches.artist[0].image[1]['#text'];
                    //        var template = $compile('<a href="' + ytUrl + '" target=\'__blank\'><img src="' + albumImage +
                    //            '" class="song-image"/><md-tooltip style="color: black;">' + result[i].artist['#text'] + ' / ' + result[i].name +
                    //            '</md-tooltip></a>')($scope);
                    //        angular.element( document.querySelector('#lastfm-widget')).append(template);
                    //    }, function errorCallback (response) {
                    //        console.log('epic fail', response);
                    //    });
                    //}

            }
            var lastfmSite = $compile('<a href="http://www.last.fm/user/joeygstrings" target=\'__blank\'>' +
                '<img class="lastfm-ender" ng-style="{\'border-left\': mainVm.borderColor}" src="assets/images/lastfm-icon.png" />' +
                '<md-tooltip style="color: #f1f1f1;">My Lastfm Profile</md-tooltip>')($scope);
            angular.element( document.querySelector('#lastfm-widget')).append(lastfmSite);

        }

        function crazyTimeAstronomy (sunTimes) {
          // mainVm.todImage = mainVm.theme === 'day' ? 'sun.png' : 'moon.png';
          function moonIcon (age) {
            // 8 main phases lasting a total of 29.5305882 days per cycle
            console.log('age', age);
          }

          function handleSunAndMoon (sunTimes) {
            console.log('sunTimes', sunTimes);
            var screenWidth = window.innerWidth,
              screenHeight = window.innerHeight - 206, // minus 64 for toolbar and 142 for image size and margin
              start = mainVm.theme === 'day' ? sunTimes.sunrise : sunTimes.sunset, // day or night time to base position off of
              today = moment().format('MM/DD/YYYY'),
              tomorrow = moment().add(1, 'day').format('MM/DD/YYYY'),
              yesterday = moment().subtract(1, 'day').format('MM/DD/YYYY');

            var sunTimeTotal = moment(today + sunTimes.sunset).diff(today + sunTimes.sunrise, 'minutes'),
              moonTimeTotalEvening = moment(tomorrow + sunTimes.sunrise).diff(today + sunTimes.sunset, 'minutes'),
              moonTimeTotal = moment(tomorrow + sunTimes.sunrise).diff(today + sunTimes.sunset, 'minutes'),
              moonTimeTotalMorning = moment(today + sunTimes.sunrise).diff(yesterday + sunTimes.sunset, 'minutes');


            if ($rootScope.theme === 'night') {
              console.log('fuck', $rootScope.theme);
              // $rootScope.theme = 'night';
              var timeSince = moment().diff(today + start, 'minutes'), // minutes since start
                timeElapsedPercent = (timeSince / moonTimeTotal),
                angle = 180 * timeElapsedPercent, // angle from half circle vertex in which sun or moon should be placed
                x = (screenWidth / 2 - 90) + screenHeight * (Math.cos(angle * (Math.PI / 180))),
                y = -60 + screenHeight * Math.sin(angle * (Math.PI / 180));;
            } else {
              // $rootScope.theme = 'day';
              var timeSince = moment().diff(today + start, 'minutes'), // minutes since start
                timeElapsedPercent = (timeSince / sunTimeTotal),
                angle = 180 * timeElapsedPercent, // angle from half circle vertex in which sun or moon should be placed
                x = (screenWidth / 2 - 90) + screenHeight * (Math.cos(angle * (Math.PI / 180))),
                y = -60 + screenHeight * Math.sin(angle * (Math.PI / 180));;
            }

            console.log('sunTimeTotal', sunTimeTotal);
            console.log('moonTimeTotalEvening', moonTimeTotalEvening);
            console.log('moonTimeTotalMorning', moonTimeTotalMorning);

            mainVm.objCoords = {x: x, y: y};
            if (y < 2.87 || screenWidth - 180 < x) { // don't cause overflow
              mainVm.showSunMoon = false;
            } else if ($rootScope.theme === 'day') {
              console.log('why am I here');
              mainVm.todImage = 'sun.png';
              mainVm.showSunMoon = true;
            } else {
              moonIcon(sunTimes.moon);
            }
          }
          handleSunAndMoon(sunTimes);
        }

        // init
        if ($rootScope.theme) {
          crazyTimeAstronomy($rootScope.sunTimes);
        } else {
          $scope.$on('theme set', function () {
            crazyTimeAstronomy($rootScope.sunTimes);
          });
        }

        (function init () {
            $http.get('/api/proxy/lastfm')
                .then(function successCallback (result) {
                  // console.log('result', result);
                    result = result.data.recenttracks.track;
                    makeLastFmWidget(result);
                }, function failureCallback (error) {
                    console.log('error with lastfm', error);
                    $scope.showLastfm = false;
                });
        })();
  });
