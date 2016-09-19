'use strict';

angular.module('portfolioApp').controller('Ng2048Ctrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'GameLogicService',
	function ($scope, $rootScope, $http, $mdDialog, GameLogicService) {
        var tfec = this,
        	gameOverDialog;
        tfec.theme = $rootScope.theme;

        $rootScope.$on('theme change', function () {
            tfec.theme = $rootScope.theme;
        });

		tfec.userScore = sessionStorage.getItem('2048score') ? parseInt(sessionStorage.getItem('2048score')) : 0;
		tfec.name = 'Player 1';

		tfec.newGame = function () {
			sessionStorage.clear();
			tfec.userScore = 0;
			GameLogicService.newGame($scope);
		};

		tfec.enteringName = function () {
			// if (tfec.enterName) $scope.$parent.tfec.name = tfec.playerName;
			tfec.enterName = !tfec.enterName;
		};

		tfec.checkForEnter = function (key) {
			console.log('key', key);
			if (key.which === 13) tfec.enteringName();
		};

		// listening to game logic service events
		$scope.$on('addScore', function (e, score) {
			$scope.$apply(function () {
				tfec.userScore += score;
			});
			var params = {name: tfec.name, score: tfec.userScore};
			if (tfec.userScore > tfec.highScore.score) {
				$http.post('/api/2048/updatescore', JSON.stringify(params))
					.success(function (data) {
						console.log('success data', data);
						$scope.$broadcast('hs', data.score);
					})
					.error(function(data) {
						console.log('error data', data);
					});				
			}
			sessionStorage.setItem('2048score', tfec.userScore);
		});

		$scope.$on('gameOver', function () {
			gameOverDialog = $mdDialog.alert({
				title: 'Game Over!',
				scope: $scope,
				textContent: 'Your score was ' + tfec.userScore + '! Good Job!',
				clickOutsideToClose: true,
				ok: 'Close'
			});
			$mdDialog.show(gameOverDialog);
		});

		(function init () {
			$http.get('/api/2048/gethighscore')
				.success(function (data) {
					console.log('success data hs', data);
					tfec.highScore = data;
				})
				.error(function(data) {
					console.log('error getting hs', data);
				});
			})();
    }
]);