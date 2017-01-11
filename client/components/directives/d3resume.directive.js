'use strict';

angular.module('portfolioApp').directive('d3Resume', ['Dataobjects',
  function (Dataobjects) {
    return {
      restrict: 'AE',
      // replace: true,
      transclude: true,
      template: '<svg></svg>',
      scope: {
        resumeOptions: '='
      },
      link: function (scope, elem) {
        console.log('directive', scope.resumeOptions);
        var lastTimeout = null;
        var formatToShow = d3.timeFormat('%m/%d/%Y');
        var format = d3.timeFormat('%Y-%m-%d');
        var parseDate = d3.timeParse(format);
        var svg = null;
        var config = scope.resumeOptions;
        var x = null;
        var y = null;
        var xAxis = null;
        var screenWidth = window.innerWidth;
        var ticks;

        if (screenWidth >= 1200) {
          ticks = 30;
        } else if (screenWidth < 1200 && screenWidth >= 600) {
          ticks = 20;
        } else if (screenWidth < 600) {
          ticks = 15;
        }

        function normalize (rData) {
          for (var key in rData) {
            console.log('key', key);
            rData[key] = rData[key].map(function (d, index) {
              d.id = index + 1;
              d.from = parseDate(d.from);
              if (d.to === null) {
                d.pto = new Date();
              } else {
                d.to = parseDate(d.to);
                d.pto = d.to;
              }
              return d;
            });
          }
        }

        function loadData (error, data) {
          var rData = scope.resumeOptions.rData;
          data = {};
          // data = normalize(scope.resumeOptions.rData);
          for (var key in rData) {
            data[key] = rData[key].map(function (d, index) {
              d.id = index + 1;
              d.from = parseDate(d.from);
              if (d.to === null) {
                d.pto = new Date();
              } else {
                d.to = parseDate(d.to);
                d.pto = d.to;
              }
              return d;
            });
          }
          console.log('data', data);

          x.domain([
            d3.min([
              d3.min(data.experience, function(d) { return d.from; }),
              d3.min(data.study, function(d) { return d.from; })
            ]),
            d3.max([
              d3.max(data.experience, function(d) { return d.pto; }),
              d3.max(data.study, function(d) { return d.pto; })
            ])
          ]);

          calculateDiameter(data.experience);
          calculateDiameter(data.study);

          var graphContainer = svg
            .append('g')
            .attr('class', 'graph-container')
            .attr('transform', 'translate(' + [0,config.height - 140] + ')');

          var xAxilsEl = graphContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + 0 + ')')
            .call(xAxis);

          xAxilsEl.selectAll('text')
            .style('text-anchor', 'end')
            .attr('transform', 'translate('+[0,2]+') rotate(-70)');

          graphContainer.append('text')
            .classed('axis-label',true)
            .text('WORKS')
            .style('text-anchor', 'center')
            .attr('transform', 'translate('+[25,- 63]+') rotate(-90)');

          graphContainer.append('text')
            .classed('axis-label',true)
            .text('STUDIES')
            .style('text-anchor', 'center')
            .attr('transform', 'translate('+[25,138]+') rotate(-90)');

          loadItems(svg, graphContainer, data.experience, 'experience', -1, config.height / 8, config.getItemFillCollor);
          loadItems(svg, graphContainer, data.study, 'study', 1, config.height / 8, config.getItemFillCollor);
        };

        var getPath = function (diameter, position) {
          var radius = diameter/2;
          var height = position * (40 + radius * 0.7);
          return 'M0,0 q '+radius+' '+height+' '+diameter+' 0 z';
        };

        var calculateDiameter = function (data) {
          data.forEach(function(d) {
            d.diameter = x(d.pto)-x(d.from);
            if (d.to === null) {
              d.diameter = d.diameter * 2;
            }
          });
          data.sort(function(a,b){
            return b.diameter - a.diameter;
          });
        };

        var addItemDetail = function (wrapper, size, position, weight, text) {
          wrapper.append('text')
            .attr('font-size',size)
            .style('font-weight', weight)
            .text(text)
            .attr('transform', position);
        };


        var loadItems = function (svg, graphContainer, data, className, position, infoTopPosition, getItemFillCollor) {

          var gInfo = svg
            .selectAll('g.info.'+className)
            .data(data)
            .enter()
            .append('g')
            .attr('class',function(d) { return className + d.id; })
            .classed('info',true)
            .classed('default',function(d) {return d.default_item;})
            .classed(className,true)
            .attr('transform', 'translate('+[config.width*0.1,infoTopPosition]+')')
            .attr('fill-opacity', function(d) {
              return d.default_item ? 1 : 0;
            });

          addItemDetail(gInfo, '18px', 'translate('+[0,0]+')', 'normal', function(d) {return d.type;});
          addItemDetail(gInfo, '18px', 'translate('+[0,25]+')', 'normal', function(d) {return d.title;});
          addItemDetail(gInfo, '23px', 'translate('+[0,50]+')', 'bold',function(d) {return d.institution;});
          addItemDetail(gInfo, '14px', 'translate('+[0,70]+')', 'bold', function(d) {
            var text = formatToShow(d.from) + ' - ';
            if (d.to === null) {
              text += 'Now';
            } else {
              text += formatToShow(d.to);
            }
            return text;
          });

          var descriptionWrapper = gInfo.selectAll('text.description')
            .data(function(d, i) {
              var position = 70;
              return d.description.split('\n').map(function(i){
                position += 20;
                return {
                  text:i,
                  position:position
                };
              });
            })
            .enter();

          addItemDetail(descriptionWrapper, '14px', function(d) {return 'translate(0,'+d.position+')';},
            'normal',function(d){return d.text;});


          graphContainer
            .selectAll('path.'+className)
            .data(data)
            .enter()
            .append('path')
            .classed(className,true)
            .classed('item',true)
            .attr('fill', function (d) {return getItemFillCollor(d);})
            .attr('fill-opacity', 0.6)
            .attr('d',function(d) { return getPath(d.diameter, position); })
            .attr('transform', function(d) {
              return 'translate(' + [x(d.from),  0] + ')';
            })
            .on('mouseover', function(d) {
              graphContainer.selectAll('path.item').transition()
                .attr('stroke-width', '1')
                .attr('fill-opacity', 0.2);
              d3.select(this).transition()
                .attr('stroke-width', '2')
                .attr('fill-opacity', 1);
              showInfo(svg, className, d);
            })
            .on('mouseout', function(d) {
              graphContainer
                .selectAll('path.item')
                .transition()
                .attr('stroke-width', '2')
                .attr('fill-opacity', 0.5);
              lastTimeout = setTimeout(hideInfo,3000);
            });
        };

        var hideInfo = function () {
          svg.selectAll('g.info').transition().attr('fill-opacity', 0);
          svg.selectAll('g.info.default').transition().attr('fill-opacity', 1);
        };

        var showInfo = function (svg, className, d) {
          if (lastTimeout) {
            clearTimeout(lastTimeout);
            lastTimeout = null;
          }
          svg.selectAll('g.info').transition().attr('fill-opacity', 0);
          svg.selectAll('g.info.'+className+'.'+className+d.id).transition().attr('fill-opacity', 1);
        };

        function init() {
          var elemSvg = elem.find('svg')[0];
          console.log('elemSvg', elem);
          svg = d3
            .select(elemSvg)
            .append('svg')
            .attr('width', config.width)
            .attr('height', config.height);

          x = d3.scaleTime().range([20, config.width]);
          y = d3.scaleTime().range([config.height, 0]);
          y.domain([0, config.height]);

          xAxis = d3.axisBottom(x)
            .tickArguments([ticks, 's'])
            .tickFormat(d3.timeFormat('%b %Y'));

          loadData();
        };
        init();
      }
    };
  }
]);
