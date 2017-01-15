'use strict';

angular.module('portfolioApp').directive('svgPie', ['Dataobjects',
  function (Dataobjects) {
    return {
      restrict: 'AE',
      // replace: true,
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
          colorArr = Array.apply(null, {length: scope.pieOptions}).map(function () {return colors[Math.floor(Math.random()*48)];}),
          elemSvg = elem.find('svg')[0];;
        console.log('pieOptions', scope.pieOptions);
        console.log('colorArr', colors);

        var color = d3.scaleOrdinal()
        .range(colorArr);

        var arc = d3.arc()
        .outerRadius(radius - 50)
        .innerRadius(0);

        var pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d[scope.pieOptions.dataValue];
        });

        var svg = d3.select(elemSvg)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + '','' + height / 2 + '')'');

        var labelArc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 150);

        var g = svg.selectAll('.arc')
        .data(pie(scope.pieOptions.data))
        .enter().append('g')
        .attr('class', 'arc');

        g.append('path')
        .attr('d', arc)
        .style('fill', function (d) {
          console.log('dataKey', d);
          return colors[d.data.colorIndex];
        });

        // g.append('text')
        // .attr('transform', function (d) {
        //   return 'translate(' + arc.centroid(d) + ')';
        // })
        // .attr('dy', '.35em')
        // .style('text-anchor', 'top')
        // .text(function (d) {
        //   return d.data[scope.pieOptions.dataKey];
        // });

        g.append('text')
        .attr('transform', function(d) {
          var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
          return 'translate(' + labelArc.centroid(d)[0] + '','' + labelArc.centroid(d)[1] + '') rotate(-90) rotate('' + (midAngle * 180/Math.PI) + '')''; })
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .text(function(d) { return (d.data[scope.pieOptions.dataValue] > 2) ? d.data[scope.pieOptions.dataKey] : null; });
      }
    };
  }
]);
