'use strict';

angular.module('portfolioApp').controller('GamesEditorCtrl', ['VgData', '$state',
  function (VgData, $state) {
    var gec = this;

    gec.state = {
      loggedIn: false,
      which: 'gameLib'
    };

    function badToken () {
      gec.state.loggedIn = false;
      sessionStorage.setItem('jgToken', '');
      $state.go('gameslogin');
    }

    function getToken () {
      return sessionStorage.getItem('jgToken') || false;
    }

    VgData.checkToken(getToken()).then(function (response) {
      if (response.data.loggedIn && !response.data.error) {
        gec.state.loggedIn = true;
      } else {
        badToken();
      }
    });
  }
]);
