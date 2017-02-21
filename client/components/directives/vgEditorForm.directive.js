'use strict';

angular.module('portfolioApp').directive('vgForm', ['GB',
  function (GB) {
    return {
      restrict: 'AE',
      templateUrl: 'components/directives/vgEditorForm.directive.html',
      scope: {
        formOptions: '='
      },
      link: function (scope, elem) {
        scope.state = {
          current: 'add',
          which: scope.formOptions.which
        };

        scope.searchParams = {};

        scope.changeState = function (state) {
          scope.state.current = state;

        };

        scope.lookup = function () {
          console.log('searchParams', scope.searchParams);
          GB.getGameData(scope.searchParams.gbId, scope.formOptions.gbSearch).then(function (response) {
            console.log('response', response);
            if (!response.error) {
              scope.gbInfo = response.response;
            } else {
              scope.gbInfo = false;
            }
          });
        };
      }
    };
  }
]);
