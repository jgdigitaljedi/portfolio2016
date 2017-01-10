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
				cc.labelColor = '#ffc107';
			}
		}

		function openDialog (which) {
		  var whichTemplate = which === 'success' ? '/app/contact/modals/success.contact.modal.html' :
        '/app/contact/modals/failure.contact.modal.html';

		  $mdDialog.show({
		    controller: 'ContactModalCtrl',
        templateUrl: whichTemplate,
        parent: angular.element(document.body),
        locals: {whichModal: which, theme: cc.theme}
      });
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
				  console.log('error', res);
				  openDialog('failure');
				} else {
				  openDialog('success');
				}
				console.log('success');
			}).error(function() {
        openDialog('failure');
			});
		};

		(function init () {
			cc.theme = $rootScope.theme;
			colorHoldouts();
		})();
	}
]);
