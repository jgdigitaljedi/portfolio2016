'use strict';

angular.module('portfolioApp').controller('GamesEditorCtrl', ['VgData', '$state', '$timeout', '$rootScope',
  function (VgData, $state, $timeout, $rootScope) {
    var gec = this;

    gec.theme = 'day';
    gec.toastOptions = {
      trigger: false
    };

    gec.state = {
      loggedIn: false,
      editing: false
    };

    switch($state.current.name) {
      case 'gameseditor.hwLib':
        gec.currentTabIndex = 1;
        break;
      case 'gameseditor.gameWl':
        gec.currentTabIndex = 2;
        break;
      case 'gameseditor.conWl':
        gec.currentTabIndex = 3;
        break;
      default:
        gec.currentTabIndex = 0
        $state.go('gameseditor.gamesLib');
        break;
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
      console.log('editor token check', response);
      if (response.data.status === 200 && !response.data.error) {
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
