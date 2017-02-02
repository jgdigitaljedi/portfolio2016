'use strict';

angular.module('portfolioApp').factory('GB', ['$http', '$q',
  function($http, $q) {
    function getGameData (id) {
      var def = $q.defer();
      $http({
        method: 'GET',
        url: '/api/proxy/giantbomb/game/' + id,
      }).then(function (response) {
        def.resolve({error: false, response: response.data.results});
      }).catch(function (error) {
        def.reject({error: true, response: error});
      });
      return def.promise;
    }

    return {
      getGameData: getGameData
    };
  }
]);
