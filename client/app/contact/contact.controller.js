'use strict';

angular.module('portfolioApp').controller('ContactCtrl', ['$scope', '$http', '$mdDialog', '$rootScope',
	function($scope, $http, $mdDialog, $rootScope) {
		// TODO: fix success and failure modals and add loading animation while sending
		var cc = this;

		function colorHoldouts () {
			if (cc.theme === 'day') {
				cc.buttonColor = '#ffc107';
				cc.labelColor = '#212121';
			} else {
				cc.buttonColor = '#ffc107';
				cc.labelColor = '#f1f1f1';
			}
		}

		$rootScope.$on('theme change', function () {
		    cc.theme = $rootScope.theme;
		    colorHoldouts();
		});

		cc.sendEmail = function(user) {
			$http.post('/api/proxy/contact', {
				firstName: user.firstName,
				email: user.email,
				lastName: user.lastName,
				company: user.company,
				comment: user.comments
			}).success(function(res) {
				if(res.error) {
					$mdDialog.show({
					    controller: function DialogController($scope, $mdDialog) {
					    	$scope.theme = cc.theme;
		            		$scope.closeDialog = function() {
		              			$mdDialog.hide();
		            		};
		          		},
					    templateUrl: '/app/contact/modals/failure.contact.modal.html',
					    parent: angular.element(document.body)
					});
				} else {
					$mdDialog.show({
					    controller: function DialogController($scope, $mdDialog) {
					    	$scope.theme = cc.theme;
		            		$scope.closeDialog = function() {
		              			$mdDialog.hide();
		            		};
		          		},
					    templateUrl: '/app/contact/modals/success.contact.modal.html',
					    parent: angular.element(document.body)
					});
				}
				console.log('success');
			}).error(function() {
				$mdDialog.show({
				    controller: function DialogController($scope, $mdDialog) {
				    	$scope.theme = cc.theme;
	            		$scope.closeDialog = function() {
	              			$mdDialog.hide();
	            		};
	          		},
				    templateUrl: '/app/contact/modals/failure.contact.modal.html',
				    parent: angular.element(document.body)
				});
				console.log('error');
			});

			$scope.closeDialog = function() {
				$mdDialog.hide();
			};

		};		
		
		(function init () {
			cc.theme = $rootScope.theme;
			colorHoldouts();
		})();
	}
]);