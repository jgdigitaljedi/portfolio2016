'use strict';

angular.module('portfolioApp')
    .controller('MainCtrl', function ($scope, $http, $compile) {
        var mainVm = this;
        mainVm.showLastfm = true;

        function makeLastFmWidget(result) {
            for(var i = 0; i < 5; i++) {
                var artistWeb = result[i].artist['#text'].split(' ').join('+'),
                    nameWeb = result[i].name.split(' ').join('+'),
                    ytUrl = 'https://www.youtube.com/results?search_query=' + artistWeb + '-' + nameWeb,
                    albumImage = result[i].image[1]['#text'] ? result[i].image[1]['#text'] : '../../../assets/images/no-image.png',
                    template = $compile('<a href="' + ytUrl + '" target=\'__blank\'><img src="' + albumImage +
                        '" class="song-image"/><md-tooltip style="color: black;">' + result[i].artist['#text'] + ' / ' + result[i].name +
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
                '<img class="lastfm-ender" src="assets/images/lastfm-icon.png" />' +
                '<md-tooltip style="color: black;">My Lastfm Profile</md-tooltip>')($scope);
            angular.element( document.querySelector('#lastfm-widget')).append(lastfmSite);

        }

        $http.get('/lastfm')
            .success(function(result) {
                result = result.recenttracks.track;
                makeLastFmWidget(result);
            }).error(function(result) {
                $scope.showLastfm = false;
            });
  });
