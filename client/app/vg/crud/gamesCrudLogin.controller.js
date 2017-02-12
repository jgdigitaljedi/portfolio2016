'use strict';

angular.module('portfolioApp').controller('GamesLoginCtrl', ['VgData', '$state',
  function (VgData, $state) {
    var glc = this;

    glc.state = {
      user: '',
      password: ''
    };

    function simpleEncryptPassword (pass) {
      var pass = CryptoJS.SHA1(pass);
      return pass.words.join(''); // very simple encryption because only me as user served over ssl from hidden route
    };

    glc.authenticate = function () {
      if (glc.state.user.length && glc.state.password.length) {
        var pass = simpleEncryptPassword(glc.state.password);

        VgData.gamesAuth({user: glc.state.user, pass: pass}).then(function (response) {
          sessionStorage.setItem('jgToken', response.data.token);
          $state.go('gameseditor');
        });
      }
    };

    (function () {
      var sessionToken = sessionStorage.getItem('jgToken') || false;
      if (sessionToken) {
        VgData.checkToken(sessionToken).then(function (response) {
          if (response.data.loggedIn && !response.data.error) {
            $state.go('gameseditor');
          }
        });
      }
    })();
  }
]);
