'use strict';

angular.module('portfolioApp').directive('svgPie', ['Dataobjects',
  function (Dataobjects) {
    return {
      restrict: 'AE',
      transclude: true,
      template: '<svg></svg>',
      scope: {
        pieOptions: '='
      },
      link: function (scope, elem) {
        var width = scope.pieOptions.width,
          height = scope.pieOptions.height,
          radius = Math.min(width, height) / 2,
          colors = Dataobjects.getMaterialColors(),
          elemSvg = elem.find('svg')[0];

        var tooltip = d3.select('body').append('div')
          .style('position','absolute')
          .style('padding','0 10px')
          .style('opacity', 0)
          .attr('class','tooltip');

        var arc = d3.arc()
        .outerRadius(radius - 50)
        .innerRadius(0);

        var arcOver = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

        var pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d[scope.pieOptions.dataValue];
        });

        var svg = d3.select(elemSvg)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');


        var labelArc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 150);

        var g = svg.selectAll('.arc')
        .data(pie(scope.pieOptions.data))
        .enter().append('g')
        .attr('class', 'arc');

        function mouseAction (path, ele) {
          d3.select(path).transition()
          .duration(500)
          .attr('d', arcOver)
          .style("fill", function(d){return d3.rgb(colors[ele.data.colorIndex]).darker(1);});

          tooltip.transition()
          .style('opacity', 1);

          tooltip.html(ele.data[scope.pieOptions.dataKey])
          .style('left',(d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY + 10) + 'px')
          .append('p')
          .text(ele.data[scope.pieOptions.dataValue]);
        }

        g.append('path')
        .attr('d', arc)
        .style('fill', function (d) {
          return colors[d.data.colorIndex];
        })
        // .attr('stroke', 'white')
        .attr('shape-rendering', 'optimizeQuality')
        .attr('stroke-width', 0)
        .attr('id', function (d) {
          return  d.data.genre.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '');
        })
        .on('mouseover', function (d) {
          mouseAction(this, d);
        })
        .on('mouseout', function () {
          tooltip.transition()
            .style('opacity', 0);

          d3.select(this).transition()
            .duration(500)
            .attr('d', arc)
          .style("fill", function (d) {return colors[d.data.colorIndex];});
        });

        g.append('text')
        .attr('fill', '#ffc107')
        .attr('class', 'shadow')
        .attr('transform', function(d) {
          var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2  + d.endAngle / 2 + Math.PI ;
          return 'translate(' + labelArc.centroid(d)[0] + ',' + labelArc.centroid(d)[1] + ') rotate(-90) rotate(' + (midAngle * 180 / Math.PI) + ')'; })
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .attr('shape-rendering', 'optimizeQuality')
        .text(function(d) {return (d.data[scope.pieOptions.dataValue] > 2) ? d.data[scope.pieOptions.dataKey] : null})
        .on('mouseover', function (d) {
          var idName = d.data.genre.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '');
          mouseAction(d3.select('path#' + idName).node(), d3.select('path#' + idName)._groups[0][0].__data__);
        })
        .on('mouseout', function (d) {
          tooltip.transition()
            .style('opacity', 0);

          d3.select('#' + d.data.genre.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi, '')).transition()
            .duration(500)
            .attr('d', arc)
            .style('fill', function (path) {
              return colors[path.data.colorIndex];
            });
        });
      }
    };
  }
]);
