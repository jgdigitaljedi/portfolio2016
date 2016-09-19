'use strict';

angular.module('portfolioApp').controller('RrrCtrl', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
        var rrrc = this;
        rrrc.theme = $rootScope.theme;

        $rootScope.$on('theme change', function () {
            rrrc.theme = $rootScope.theme;
        });

    }
]);