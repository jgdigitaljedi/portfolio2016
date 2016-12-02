'use strict';

angular.module('portfolioApp')
    .controller('MainCtrl', function ($scope, $http, $compile, $rootScope, $timeout) {
        var mainVm = this;
        mainVm.showLastfm = true;
        mainVm.theme = $rootScope.theme;

        $rootScope.$on('theme change', function () {
            mainVm.theme = $rootScope.theme;
            mainVm.todImage = mainVm.theme === 'day' ? 'sun.png' : 'moon.png';
        });

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

        (function init () {

            $http.get('/api/proxy/lastfm')
                .then(function successCallback (result) {
                    result = result.data.recenttracks.track;
                    makeLastFmWidget(result);
                }, function failureCallback (error) {
                    console.log('error with lastfm', error);
                    $scope.showLastfm = false;
                });

            mainVm.todImage = mainVm.theme === 'day' ? 'sun.png' : 'moon.png';
            $timeout(function () {
                var screenWidth = window.innerWidth;
                var screenHeight = window.innerHeight - 206; // minus 64 for toolbar and 20 more for a comfortable margin and 90 more to center object
                var start = mainVm.theme === 'day' ? ' 07:00' : ' 19:00'; // day or night time to base position off of
                var today = moment().format('MM/DD/YYYY');
                var timeSince = moment().diff(today + start, 'minutes'); // minutes since start
                var timeElapsedPercent = (timeSince / 720); // 12 hours is 720 minutes
                var angle = 180 * timeElapsedPercent; // angle from half circle vertex in which sun or moon should be placed
                // var angle = 90; // here for testing
                var x = (screenWidth / 2 - 90) + screenHeight * (Math.cos(angle*(Math.PI/180)));
                var y = 0 + screenHeight * Math.sin(angle*(Math.PI/180));
                mainVm.objCoords = {x: x, y: y};
                // console.log('width', screenWidth);
                // console.log('height', screenHeight);
                // console.log('coords are ' + x + ' and ' + y);                
            });
        })();
  });
