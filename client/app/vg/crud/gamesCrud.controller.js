'use strict';

angular.module('portfolioApp').controller('GamesEditorCtrl', [
  function () {
    var gec = this;

    gec.state = {
      user: '',
      password: '',
      addWhich: 'game',
      loggedIn: false
    };
  }
]);
