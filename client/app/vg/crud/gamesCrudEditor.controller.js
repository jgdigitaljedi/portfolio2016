'use strict';

angular.module('portfolioApp').controller('GamesEditorCtrl', ['VgData', '$state', '$timeout', '$rootScope',
  function (VgData, $state, $timeout, $rootScope) {
    var gec = this;

    gec.theme = $rootScope.theme;
    gec.toastOptions = {
      trigger: false
    };

    gec.state = {
      loggedIn: false,
      editing: false
    };

    if ($state.current.name === 'gameseditor') {
      $state.go('gameseditor.gamesLib');
    }

    function badToken () {
      gec.state.loggedIn = false;
      sessionStorage.setItem('jgToken', '');
      gec.deniedOptions = {
        style: 'warning',
        timeout: 3500,
        text: 'Access Denied',
        trigger: true
      };
      $timeout(function () {
        $state.go('gameslogin');
      }, 4000);
    }

    function getToken () {
      return sessionStorage.getItem('jgToken') || false;
    }

    VgData.checkToken(getToken()).then(function (response) {
      if (response.data.loggedIn && !response.data.error) {
        gec.state.loggedIn = true;
        gec.toastOptions = {
          style: 'success',
          timeout: 3500,
          text: 'Welcome Joey!',
          trigger: true
        };
      } else {
        badToken();
      }
    });
  }
]);
