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
          add: true
        };
      }
    };
  }
]);
