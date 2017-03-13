'use strict';

angular.module('portfolioApp').directive('vgForm', ['GB', 'VgData', '$timeout', '$q', '$compile', '$mdDialog',
  function (GB, VgData, $timeout, $q, $compile, $mdDialog) {
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
          lastId: 0,
          which: scope.formOptions.which,
          tooltip: {
            show: false,
            arr: []
          },
          edit: {
            cellData: '',
            cellEle: '',
            rowData: '',
            rowEle: '',
            editing: false
          }
        };

        function getGames () {
          VgData[scope.formOptions.endpoints.get](true).then(function (result) {
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
              if (parseInt(item.id) > scope.state.lastId) scope.state.lastId = parseInt(item.id);
            });
            scope.consoleDd = consoleDd;
            scope.genreList = genreList;
          });
        }

        getGames(scope.formOptions.endpoints.get);
        scope.showConDd = scope.formOptions.consoleDd || false;
        scope.searchParams = {addeddate: moment().format('MM/DD/YYYY')};

        function deleteDataCall (item) {
          var token = sessionStorage.getItem('jgToken');
          VgData.editorCall({game: item, token: token}, scope.formOptions.endpoints.delete)
            .then(function (response) {
              triggerToast({style: 'success', text: item.title + ' deleted!'});
            })
            .catch(function (err) {
              triggerToast({style: 'warning', text: item.title + ' NOT DELETED!! ERROR!'});
            });
        }

        function makeEditCall (request) {
          VgData.editorCall(request, scope.formOptions.endpoints.edit)
            .then(function (response) {
              console.log('resposne from edit', response);
              triggerToast({style: 'success', text: request.game.title + ' edited!!'});
            })
            .catch(function (err) {
              console.log('error from edit', err);
              triggerToast({style: 'warning', text: request.game.title + ' NOT EDITED!! ERROR!'});
            });
        }

        scope.taKeypress = function (key) {
            if (key.charCode === 13) {
              scope.state.edit.cellData.data(scope.editText);
              angular.element('#edit-textarea').remove();
              scope.state.edit.editing = false;
              makeEditCall({game: scope.state.edit.rowData, token: sessionStorage.getItem('jgToken')});
            }
        };

        function deleteRow (data, ele) {

          var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete ' + data.title + ' from your library?')
            .textContent('Dude, you\'re trying to collect, not get rid of stuff!')
            .ariaLabel('Really?')
            .targetEvent(ele)
            .ok('Confirm')
            .cancel('Nope');

          $mdDialog.show(confirm).then(function () {
            scope.table.row(ele).remove();
            scope.table.draw();
            deleteDataCall({id: data.id, title: data.title});
          }, function () {
            console.log('user cancelled delete');
          });
        }

        function handleExtraAction (data, ele) {

          //TODO: make this legit modal so case option can be added
          if (scope.formOptions.which === 'gamesWl') {
            data.cib = '';
            var confirm = $mdDialog.confirm()
              .title('Are you sure you want to add ' + data.title + ' to your library?')
              .textContent('Yeah! New game day!')
              .ariaLabel('Really?')
              .targetEvent(ele)
              .ok('Confirm')
              .cancel('Nope');

            $mdDialog.show(confirm).then(function () {
              var request = {
                gameRequest: {
                  gameData: data,
                  token: sessionStorage.getItem('jgToken')
                }
              };
              VgData.editorCall(request, 'addGame').then(function (result) {
                if (!result.data.error) {
                  triggerToast({style: 'success', text: request.gameRequest.gameData.title + ' Added!'});
                  scope.table.row(ele).remove();
                  scope.table.draw();
                  deleteDataCall({id: data.id, title: data.title});
                  getGames();
                } else {

                }
              });
            }, function () {
              console.log('user cancelled move');
            });
          }
        }

        scope.handleInlineEditing = function (rowData, rowEle, cellData, cellEle) {
          if (angular.element(cellEle).find('.game-delete').length > 0 ) {
            deleteRow(rowData, rowEle);
          } else if (angular.element(cellEle).find('.extra-action').length > 0 ) {
            handleExtraAction(rowData, rowEle);
          } else if (!scope.state.edit.editing) {
            var cellProps = {
              width: angular.element(cellEle).width() + 18,
              height: angular.element(cellEle).height() + 14
            };
            scope.editText = angular.element(cellEle).text();
            var ta = $compile('<textarea id="edit-textarea" style="width: ' + cellProps.width + 'px; height: '
              + cellProps.height + 'px;" ng-keypress="taKeypress($event)" ng-model="editText">' + cellData.data() + '</textarea>')(scope);
            angular.element(cellEle).empty().append(ta);

            $('#edit-textarea').focus();
            scope.state.edit.cellData = cellData;
            scope.state.edit.cellEle = cellEle;
            scope.state.edit.rowEle = rowEle;
            scope.state.edit.rowData = rowData;
            scope.state.edit.editing = true;
          } else if (angular.element('#edit-textarea').length && angular.element(cellEle)[0] !== (angular.element('#edit-textarea').parent())[0]) {
            scope.state.edit.cellData.data(scope.editText);
            angular.element('#edit-textarea').remove();
            scope.state.edit.editing = false;
            makeEditCall({game: rowData, token: sessionStorage.getItem('jgToken')});
          }
        };

        function makeEditTable (data, container) {
          $timeout(function () {
            scope.table = $('#' + container).DataTable(data);

            $('#' + container + ' tbody').on('click', 'td', function () { // jQuery because the library uses it :(
              var rowEle = scope.table.row(this),
                rowData = scope.table.row(this).data(),
                cell = scope.table.cell(this),
                cellEle = this;
              scope.handleInlineEditing(rowData, rowEle, cell, cellEle);
            } );
          }, 250);

        }

        function getDataForEditTable (which, container) {
          if (which === 'games' || which === 'gamesWl') {
            console.log('gamesData', gamesData);
            gamesData.forEach(function (item) {
              if (!item.hasOwnProperty('rating')) item.rating = 'none';
              if (!item.hasOwnProperty('releasedate')) item.releasedate = ' -- ';
            });
            var tableData = {
              aaData: gamesData,
              aoColumns: scope.formOptions.dataTable,
              aaSorting: [[1,'asc'], [0,'asc']],
              lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
              iDisplayLength: -1
            };
            makeEditTable(tableData, container);
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
                request.gameRequest.gameData.id = scope.state.lastId + 1;
                scope.state.lastId++;
                // VgData.addGame(request).then(function (result) {
                VgData.editorCall(request, scope.formOptions.endpoints.add).then(function (result) {
                  console.log('response in directive', result);
                  if (!result.data.error) {
                    triggerToast({style: 'success', text: request.gameRequest.gameData.title + ' Added!'});
                    getGames();
                  } else {

                  }
                });
              } else {
                triggerToast({style: 'warning', text: 'ERROR ADDING ' + scope.formOptions.type + '!'});
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
