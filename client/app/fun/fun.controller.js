'use strict';

angular.module('portfolioApp').controller('FunCtrl', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
        var fc = this;
        fc.theme = $rootScope.theme;

        $rootScope.$on('theme change', function () {
            fc.theme = $rootScope.theme;
        });

    }
]);