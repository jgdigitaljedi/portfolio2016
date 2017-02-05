'use strict';

angular.module('portfolioApp').controller('ShellCtrl', ['$mdSidenav', '$mdDialog', '$scope', '$location', '$rootScope', '$state',
  function ($mdSidenav, $mdDialog, $scope, $location, $rootScope, $state) {

    $scope.socialCrap = {
      url: 'http://joeyg.me',
      name: 'Joey Gauthier\'s Portfolio'
    };
    $scope.showSocial = false;
    // SocialButtons.initButtons();
    $scope.overrideTheme = function () {
      $rootScope.theme = $rootScope.theme === 'day' ? 'night' : 'day';
      $scope.theme = $rootScope.theme;
      $rootScope.$broadcast('theme change');
    };

    $scope.isDay = $rootScope.theme === 'day' ? true : false;

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };

    $scope.toggleSocial = function () {
      $scope.showSocial = !$scope.showSocial;
    };

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.notificationsEnabled = true;
    $scope.toggleNotifications = function() {
      $scope.notificationsEnabled = !$scope.notificationsEnabled;
    };

    $scope.redial = function() {
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEv)
          .clickOutsideToClose(true)
          .parent('body')
          .title('Suddenly, a redial')
          .content('You just called a friend; who told you the most amazing story. Have a cookie!')
          .ok('That was easy')
        );
      originatorEv = null;
    };

    $scope.checkVoicemail = function() {
      // This never happens.
    };

    $scope.showAddDialog = function($event) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl: 'components/shell/dialog/dialog.html',
        controller: 'DialogController'
      });
    };

    $scope.highlight = $state.current.name;
  }
]);
