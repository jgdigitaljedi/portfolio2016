'use strict';

angular.module('portfolioApp').factory('Geolocation', ['$q', '$window', 
    function ($q, $window) {


    function getCurrentPosition() {
        var deferred = $q.defer();

        if (!$window.navigator.geolocation) {
            deferred.reject({error: true, location: 'Geolocation not supported.'});
        } else {
            $window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    deferred.resolve({error:false, location: position});
                },
                function (err) {
                    deferred.reject({error: true, location: err});
                });
        }

        return deferred.promise;
    }

    return {
        getCurrentPosition: getCurrentPosition
    };
}]);