angular.module('portfolioApp').controller('ContactModalCtrl', ['$scope', '$http', '$mdDialog', 'whichModal', 'theme',
  function ($scope, $http, $mdDialog, whichModal, theme) {
    "use strict";

    $scope.theme = theme;

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };
  }
]);
