'use strict';

angular.module('portfolioApp').directive('vgForm', ['GB', 'VgData', '$timeout',
  function (GB, VgData, $timeout) {
    return {
      restrict: 'AE',
      templateUrl: 'components/directives/vgEditorForm.directive.html',
      scope: {
        formOptions: '='
      },
      link: function (scope, elem) {
        scope.state = {
          current: 'add',
          which: scope.formOptions.which
        };

        if (scope.formOptions.consoleDd) {
          scope.showConDd = true;
          var consoleDd = [];
          VgData.getOwnedGames().then(function (result) {
            console.log('owned games', result);
            result.forEach(function (item) {
              if (consoleDd.indexOf(item.platform) < 0) {
                consoleDd.push(item.platform);
              }
            });
            scope.consoleDd = consoleDd;
            console.log('scope consoles', scope.consoleDd);
          });
        }

        scope.searchParams = {addeddate: moment().format('MM/DD/YYYY')};

        scope.changeState = function (state) {
          scope.state.current = state;

        };

        function resultCleaner (obj) { // necessary only for my sanity in the DB
          obj.forEach(function (item) {
            switch(item.field) {
              case 'original_game_rating':
                item.field = 'rating';
                item.value = Array.isArray(item.value) ? item.value[0].name : (item.value.hasOwnProperty('name') ? item.value.name : 'none');
                break;
              case 'original_release_date':
                item.field = 'releasedate';
                item.value = moment(item.value, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY');
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
            console.log('searchParams', scope.searchParams);
          });
        };

        scope.saveNew = function () {
          console.log('would save this', scope.searchParams);
          var request = {
            gameRequest: {
              gameData: scope.searchParams,
              token: sessionStorage.getItem('jgToken')
            }
          };

          VgData.addGame(request).then(function (result) {
            console.log('response in directive', result);
            if (!result.data.error) {
              scope.formOptions.toast = {
                options: {
                  style: 'success',
                  timeout: 3500,
                  text: 'Game Added!',
                  trigger: true
                }
                $timeout(function () {
                  scope.formOptions.toast.trigger = false;
                }, 4000);
              };
            } else {

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
