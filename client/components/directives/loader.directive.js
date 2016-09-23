'use strict';

angular.module('portfolioApp').directive('loader', ['$compile',
    function ($compile) {
        return {
            restrict: 'AE',
            scope: {
                show: '=?',
                aniType: '@?'
            },
            link: function (scope, elem) {
                console.log('elem', elem.parent());
                var parent = elem.parent()[0],
                    parentProps = {
                        height: parent.clientHeight + 'px',
                        width: parent.clientWidth + 'px'
                    },
                    loaderTemplate;
                console.log('parentProps', parentProps);
                if (scope.aniType === 'circle') {
                    loaderTemplate = '<md-progress-circular md-mode="indeterminate"></md-progress-circular>';
                } else {
                    loaderTemplate = '<md-progress-linear md-mode="indeterminate"></md-progress-linear>';                    
                }

                var loadTemp = $compile('<div ng-show="show" class="loader-dir" layout="column" layout-align="center center" style="height: ' +
                    parentProps.height + '; width: ' + parentProps.width +';">'+
                    loaderTemplate +
                '</div>')(scope);

                elem.html(loadTemp);
            }
        };
    }
]);