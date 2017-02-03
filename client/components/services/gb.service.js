'use strict';

angular.module('portfolioApp').factory('GB', ['$http', '$q',
  function($http, $q) {

    function getGameData (id, which) {
      var def = $q.defer();
      $http({
        method: 'GET',
        url: '/api/proxy/giantbomb/' + which + '/' + id,
      }).then(function (response) {
        if (which === 'game' || which === 'platform') {
          def.resolve({error: false, response: response.data.results});
        }
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
