angular.module('portfolioApp').directive('enterPressed', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13 || event.which === 9) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterPressed);
                });

                event.preventDefault();
            }
        });
    };
});