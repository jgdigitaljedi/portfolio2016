'use strict';

angular.module('portfolioApp').directive('skillChart', ['Dataobjects', '$compile',
    function(Dataobjects, $compile) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
                skillData: '=',
                chartWidth: '='
            },
            link: function(scope, elem, attrs) {
                console.log('skillData', scope.skillData);
                console.log('chartWidth', scope.chartWidth);

                function createChart () {
                    var template = '',
                        colors = Dataobjects.getMaterialColors(),
                        cLen = colors.length,
                        skillsLen = scope.skillData.skillList.length,
                        barWidth = scope.chartWidth / ((skillsLen*2) + 1);
                    console.log('bar width is ' + barWidth + ' and skillsLen is ' + skillsLen + ' and chart area is ' + scope.chartWidth);
                    scope.skillData.skillList.forEach(function (item) {
                        template += '<div class="chart-bar" style="background-color: '+
                            colors[Math.floor(Math.random() * cLen) + 1] +'; height: ' + 320 * (item.rating / 100) +
                            'px; width: ' + barWidth + 'px;" layout="column">'+
                                '<span>' + item.name + '</span>' +
                            '</div>';
                    });
                    // scope.template = $compile(template)(scope);                    
                    scope.template = template;   
                    elem.html($compile(template)(scope));                 
                }

                scope.$watch('skillData', function () {
                    createChart();
                });

                scope.$watch('chartWidth', function () {
                    createChart();
                });
                createChart();
            }
        };
    }
]);