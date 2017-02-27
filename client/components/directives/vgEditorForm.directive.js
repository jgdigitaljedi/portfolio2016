'use strict';

angular.module('portfolioApp').directive('vgForm', ['GB', 'VgData', '$timeout', '$q', '$compile',
  function (GB, VgData, $timeout, $q, $compile) {
    return {
      restrict: 'AE',
      templateUrl: 'components/directives/vgEditorForm.directive.html',
      scope: {
        formOptions: '='
      },
      link: function (scope, elem) {
        var consoleDd = [],
          genreList = [],
          gamesData;

        scope.state = {
          current: 'add',
          which: scope.formOptions.which,
          tooltip: {
            show: false,
            arr: []
          }
        };

        if (scope.formOptions.which === 'games') {
          scope.showConDd = true;
          VgData.getOwnedGames().then(function (result) {
            console.log('owned games', result);
            gamesData = result;
            result.forEach(function (item) {
              if (scope.formOptions.consoleDd && consoleDd.indexOf(item.platform) < 0) {
                consoleDd.push(item.platform);
              }
              var genres = item.genre.split(',');
              genres.forEach(function (g) {
                if (genreList.indexOf(g) < 0) genreList.push(g);
              });
            });
            scope.consoleDd = consoleDd;
            scope.genreList = genreList;
          });
        }

        scope.searchParams = {addeddate: moment().format('MM/DD/YYYY')};

        function makeEditTable (data, container) {
          console.log('container', container);
          $timeout(function () {
            $('#' + container).DataTable(data);
          }, 250);

        }

        function getDataForEditTable (which, container) {
          console.log('gamesData', gamesData);
          if (which === 'games') {
            gamesData.forEach(function (item) {
              if (!item.hasOwnProperty('rating')) item.rating = 'none';
              if (!item.hasOwnProperty('releasedate')) item.releasedate = ' -- ';
            });
            var tableData = {
              aaData: gamesData,
              aoColumns: [
                {'mDataProp': 'title', title: 'Title'},
                {'mDataProp': 'platform', title: 'Platform'},
                {'mDataProp': 'genre', title: 'Genre'},
                {'mDataProp': 'price', title: 'Value', render: {'_': 'filter', 'filter': 'filter', 'display': 'display'}},
                {'mDataProp': 'rating', title: 'Rating'},
                {'mDataProp': 'releasedate', title: 'Released'},
                {'mDataProp': 'addeddate', title: 'Added'},
                {'mDataProp': null, 'bSortable': false, 'mRender': function (o) {return '<button class="game-delete">Delete</button>';}}
              ],
              aaSorting: [[1,'asc'], [0,'asc']],
              lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
              iDisplayLength: -1
            };
            makeEditTable(tableData, container);
            // attach row click event for editing
            // attach delete button click event for confirmation dialog and delete action
          }
        }

        scope.changeState = function (state) {
          scope.state.current = state;
          if (state === 'edit') {
            $timeout(function () {
              var ele = angular.element(document.querySelector('.edit-table-container')),
                container = scope.formOptions.which + '-' + state + '-table',
                tableCon = $compile('<table id="' + container + '"></table>')(scope);
              ele.append(tableCon);
              getDataForEditTable(scope.formOptions.which, container);
            }, 200);
          }

        };

        function resultCleaner (obj) { // necessary only for my sanity in the DB
          obj.forEach(function (item) {
            switch(item.field) {
              case 'original_game_rating':
                var result = false,
                  resultArr = [];
                item.field = 'rating';
                if (item.value && Array.isArray(item.value)) {
                  resultArr = item.value.map(function (x) {
                    if (x.name.substring(0, 4) === 'ESRB') result = x.name;
                    return x.name;
                  }).join(',');
                  item.value = result || resultArr;
                } else if (item.value && item.value.hasOwnProperty('name')) {
                  item.value = item.value.name;
                } else {
                  item.value = 'none';
                }
                break;
              case 'original_release_date':
                item.field = 'releasedate';
                item.value = item.value ? moment(item.value, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY') : 'unknown';
                break;
              case 'genres':
                var genArr = [];
                item.field = 'genre';
                console.log('genres', item.value);
                item.value.forEach(function (i) {
                  genArr.push(i.name);
                });
                item.value = genArr.join(', ');
                break;
              case 'name':
                item.field = 'title';
                break;
              default:
                item = item;
            }
            scope.searchParams[item.field] = item.value;
          });
          return obj;
        }

        function triggerToast (options) {
          scope.formOptions.toast = {
            options: {
              style: options.style,
              timeout: 3500,
              text: options.text,
              trigger: true
            }
          };
          $timeout(function () {
            scope.formOptions.toast.trigger = false;
          }, 4000);
        }

        scope.showTooltip = function (which) {
          console.log('show tt', which);
          scope.state.tooltip.show = true;
          if (which === 'genreList') {
            var template = '<table class="genre-table"><tr>',
              gLen = scope.genreList.length;
            scope.genreList.forEach(function (item, index) {
              template += '<td>' + item + '</td>';
              if ((gLen - 1) === index) {
                template += '</tr></table>';
              } else if ((index + 1) % 3 === 0) {
                template += '</tr><tr>';
              }
            });
            var compiled = $compile(template)(scope);
            $timeout(function () {
              var ele = angular.element(document.querySelector('#tt-template-content'));
              ele.append(compiled);
            }, 250); // give it a chance to render the element before appending
          }

        };

        scope.removeTooltip = function () {
          var element = angular.element(document.querySelector('#tt-template-content'));
          element.empty();
          scope.state.tooltip.show = false;

        };

        scope.lookup = function () {
          GB.getGameData(scope.searchParams.gbId, scope.formOptions.gbSearch).then(function (response) {
            console.log('response', response);
            if (!response.error) {
              var cleaned = [];
              scope.formOptions.resultFields.forEach(function (item) {
                cleaned.push({value: response.response[item.field], label: item.label, field: item.field});
              });
              scope.gbInfo = resultCleaner(cleaned);
              console.log('gbInfo', scope.gbInfo);
            } else {
              scope.gbInfo = false;
            }
          });
        };

        function validateSearchParams (params) {
          var def = $q.defer(),
            valid = true,
            paramsArr = scope.formOptions.paramsArr,
            exit = scope.formOptions.paramsArr.length - 1;

          paramsArr.forEach(function (item, index) {
            if (!params.hasOwnProperty(item) || typeof(params[item]) !== 'string' || params[item].length <= 0) {
              valid = false;
            }
            if (item === 'addeddate' || item === 'releasedate') {
              if (params[item] !== 'unknown') {
                var validDate = moment(params[item], 'MM/DD/YYYY', true).isValid();
                if (!validDate) valid = false;
              }
            }
            if (index === exit) def.resolve(valid);
          });

          return def.promise;
        }

        scope.saveNew = function () {
          console.log('would save this', scope.searchParams);
          validateSearchParams(scope.searchParams)
            .then(function (valid) {
              if (valid) {
                var request = {
                  gameRequest: {
                    gameData: scope.searchParams,
                    token: sessionStorage.getItem('jgToken')
                  }
                };

                VgData.addGame(request).then(function (result) {
                  console.log('response in directive', result);
                  if (!result.data.error) {
                    triggerToast({style: 'success', text: request.gameRequest.gameData.title + ' Added!'});
                  } else {

                  }
                });
              } else {
                triggerToast({style: 'warning', text: 'ERROR ADDING GAME!'});
              }
            });
        };

        scope.clearFields = function () {
          scope.searchParams = {addeddate: moment().format('MM/DD/YYYY')};
        };

        scope.newConsole = function () {
          scope.showConDd = !scope.showConDd;
        };
      }
    };
  }
]);
