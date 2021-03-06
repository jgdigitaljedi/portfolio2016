'use strict';

angular.module('portfolioApp').directive('skillChart', ['Dataobjects', '$compile',
    function(Dataobjects, $compile) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
                skillData: '=',
                chartWidth: '=',
                chartHeight: '='
            },
            link: function(scope, elem) {

                function createChart () {
                    var template = '<div class="custom-chart-container" layout="row" layout-align="space-around end" '+
                            'style="width: 100%; height: ' + scope.chartHeight + 'px;">',
                        colors = Dataobjects.getMaterialColors(),
                        cLen = colors.length,
                        skillsLen = scope.skillData.skillList.length,
                        barWidth = scope.chartWidth / ((skillsLen*2) + 1);
                    
                    scope.skillData.skillList.forEach(function (item) {
                        template += '<div layout="column" layout-align="center center"><div>' + 
                            item.rating + '%</div><div class="chart-bar" style="background-color: '+
                            colors[Math.floor(Math.random() * cLen)] +'; height: ' + scope.chartHeight * (item.rating / 100) +
                            'px; width: ' + barWidth + 'px;" layout="column">'+
                            '</div>'+
                                '<span>' + item.name + '</span>'+
                            '</div>';
                    });
                    template += '</div>';
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