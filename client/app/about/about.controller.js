'use strict';

angular.module('portfolioApp').controller('AboutCtrl', ['$rootScope',
	function ($rootScope) {
		var ac = this;
        ac.showLastfm = true;
        ac.theme = $rootScope.theme;

        $rootScope.$on('theme change', function () {
            ac.theme = $rootScope.theme;
        });
	}
]);