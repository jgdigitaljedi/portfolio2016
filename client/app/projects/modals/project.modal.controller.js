'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('ProjectsModalCtrl', ['$scope', 'Dataobjects', '$mdDialog','$timeout', 'modalData',
  function ($scope, Dataobjects, $mdDialog, $timeout, modalData) {
    $scope.theme = modalData.theme;
    $scope.which = modalData.selectedProject;
    var thumbs = document.getElementsByClassName('film-square'),
      screenwidth = window.innerWidth;

    if($scope.which.images) {
      $scope.selectedPic = modalData.selectedProject.images[0];
    }

    $scope.makeItBig = screenwidth < 1000;

    $scope.closeGallery = function () {
      // pc.showLabel = true;
      $mdDialog.cancel();
    };

    $scope.changePic = function (e, picPath) {
      angular.element(thumbs).removeClass('selected-thumb');
      angular.element(e.target).addClass('selected-thumb');
      angular.element(document.querySelector('.big-pic')).removeClass('fade-in');
      $timeout(function () {
        angular.element(document.querySelector('.big-pic')).addClass('fade-in');
      }, 30);
      $scope.selectedPic = picPath;
    };
  }
]);
