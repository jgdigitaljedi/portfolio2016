'use strict';

angular.module('portfolioApp').controller('GamesEditorCtrl', ['VgData',
  function (VgData) {
    var gec = this;

    gec.state = {
      user: '',
      password: '',
      addWhich: 'game'
    };

    function getToken () {
      return sessionStorage.getItem('glToken') || false;
    }

    function simpleEncryptPassword (pass) {
      var pass = CryptoJS.SHA1(pass);
      console.log('pass in exc process', pass.words);
      return pass.words.join(''); // very simple encryption because only me as user served over ssl from hidden route
    };

    gec.authenticate = function () {
      if (gec.state.user.length && gec.state.password.length) {
        var pass = simpleEncryptPassword(gec.state.password);
        console.log('user', gec.state.user);
        console.log('pass', gec.state.password);
        console.log('pass encrypted', pass);

        VgData.gamesAuth({user: gec.state.user, pass: pass}).then(function (response) {
          console.log('response', response);
        });

      }


      // make the call
      // write token to session storage
    }
  }
]);
