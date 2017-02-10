'use strict';

angular.module('portfolioApp').controller('GamesEditorCtrl', [
  function () {
    var gec = this;

    gec.loggedIn = false;

    gec.state = {
      user: '',
      password: '',
      addWhich: 'game',
      loggedIn: false
    };
  }
]);
