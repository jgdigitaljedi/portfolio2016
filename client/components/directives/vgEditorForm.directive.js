'use strict';

angular.module('portfolioApp').directive('vgForm', [
  function () {
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

        scope.changeState = function (state) {
          scope.state.current = state;

        };
      }
    };
  }
]);
