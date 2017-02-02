'use strict';

angular.module('portfolioApp').directive('svgBar', ['Dataobjects',
  function (Dataobjects) {
    return {
      restrict: 'AE',
      transclude: true,
      template: '<svg></svg>',
      scope: {
        barOptions: '='
      },
      link: function (scope, elem) {
        var width = scope.barOptions.width - scope.barOptions.margin.left - scope.barOptions.margin.right,
          height = scope.barOptions.height - scope.barOptions.margin.top - scope.barOptions.margin.bottom,
          elemSvg = elem.find('svg')[0],
          colors = Dataobjects.getMaterialColors(),
          margin = {
            top: scope.barOptions.margin.top,
            right: scope.barOptions.margin.right,
            bottom: scope.barOptions.margin.bottom,
            left: scope.barOptions.margin.left
          },
          offset = {
            x: scope.barOptions.xLabelOffset
          };
        var barWidth;

        // set the ranges
        var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
        var y = d3.scaleLinear()
          .range([height - offset.x, 0]);

        var tooltip = d3.select('body').append('div')
          .style('position','absolute')
          .style('padding','0 10px')
          .style('opacity', 0)
          .attr('class','tooltip');

        function mouseAction (path, ele) {
          d3.select(path).transition()
          .duration(500)
          .style('fill', function (d) {return d3.rgb(colors[ele.colorIndex]).darker(1);});

          tooltip.transition()
          .style('opacity', 1);

          tooltip
            .html('<p><b><u>' + ele[scope.barOptions.dataKey] + '</u></b></p>')
            .style('left',(d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY + 10) + 'px')
            .append('p')
              .text(ele[scope.barOptions.dataValue] + ' ' + scope.barOptions.firstYLabel.toLowerCase())
            .append('p')
              .text('Value: $' + ele[scope.barOptions.dataExtra].toFixed(2));
        }

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(elemSvg)
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var data = scope.barOptions.data,
          dataKey = scope.barOptions.dataKey,
          dataValue = scope.barOptions.dataValue;

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d[dataKey]; }));
        y.domain([0, d3.max(data, function(d) { return d[dataValue]; })]);

        // append the rectangles for the bar chart
        svg.selectAll('.bar')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('fill', function (d) {return colors[d.colorIndex];})
          .attr('x', function(d) { return x(d[dataKey]); })
          .attr('width', function () { barWidth = x.bandwidth(); return x.bandwidth();})
          .attr('y', function(d) { return y(d[dataValue]); })
          .attr('height', function(d) { return height  - offset.x - y(d[dataValue]); })
          .on('mouseover', function (d) {
            mouseAction(this, d);
          })
          .on('mouseout', function () {
            tooltip.transition()
            .style('opacity', 0);

            d3.select(this).transition()
            .duration(500)
            .style('fill', function (d) {return colors[d.colorIndex];});
          });

        if (scope.barOptions.includeLine) {
          var dataExtra = scope.barOptions.dataExtra,
            yRight = d3.scaleLinear()
              .range([height - offset.x, 0]);

          var valueline = d3.line()
            .x(function (d) { return x(d[dataKey]); })
            .y(function (d) { return yRight(d[dataExtra]); });

          yRight.domain([0, d3.max(data, function (d) {return (d[dataExtra]);})]);

          svg.append('g')
            .attr('class', 'svg-line')
            .append('path')
              .datum(data)
              .attr('transform', 'translate(' + (barWidth / 2) + ', 0)')
              .attr('class', 'line')
              .style('stroke', 'green')
              .attr('fill', 'none')
              .attr('stroke-width', 1.5)
              .attr('d', valueline);

          // var linePath = svg.selectAll('.svg-line').data(function (d) {console.log('d', d); return d;}),
          //   lineSeries = linePath.enter().append('g').attr('class', 'dots');
          //
          // lineSeries.append('circle')
          //   .attr('r', 6)
          //   .attr('fill', function (d) {return colors[d.colorIndex]});

          var rightAxis = svg.append('g')
            .attr('transform', 'translate(' + width + ', 0 )')
            .call(d3.axisRight(yRight).tickFormat(function (d) { return '$' + d;}))
              ;
        }

        // add the x Axis
        svg.append('g')
          .attr('transform', 'translate(0,' + (height - offset.x) + ')')
          .call(d3.axisBottom(x))
        .selectAll('text')
          .attr('y', 6)
          .attr('x', -10)
          .attr('dy', '.35em')
          .attr('transform', 'rotate(-70)')
          .style('text-anchor', 'end');

        // add the y Axis
        svg.append('g')
          .call(d3.axisLeft(y));

        svg.append('text')
          .attr('transform', 'translate(' + (width/2) + ' ,' + (height + margin.top - 6) + ')')
          .style('text-anchor', 'middle')
          .text(scope.barOptions.xLabel);

        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x',0 - (height / 2) + 40)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text(scope.barOptions.firstYLabel);

        svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', width + 30)
        .attr('x',0 - (height / 2) + 40)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(scope.barOptions.secondYLabel);
      }
    };
  }
]);
