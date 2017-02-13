'use strict';

//**********************************************************
//** semi-material style toast directive
//** written by Joey Gauthier
//** Gluten-free because I have celiac and can't eat toast
//**********************************************************
// var scripts = document.getElementsByTagName("script")
// var currentScriptPath = scripts[scripts.length-1].src;
// console.log('cs path', currentScriptPath);

angular.module('portfolioApp').directive('gfToast', ['$timeout',
  function ($timeout) {
    return {
      restrict: 'AE',
      // transclude: true,
      templateUrl: 'components/directives/glutenFreeToast.directive.html',
      scope: {
        options: '='
      },
      link: function (scope, elem) {
        //scope.options = {
        //  style: String | style of toast with choices: ['warning', 'info', 'success', 'other', 'custom'],
        //  text: String | text displayed in toast,
        //  icon?: String | (optional) <md-icon md-svg-icon> params/string for custom style,
        //  timeout: integer | time displayed in milliseconds,
        //  trigger: Boolean | set to false at init then setting to true triggers toast,
        //  color?: String | (optional) color code for toast color when using 'custom' style
        // }

        console.log('trigger', scope.options.trigger);
        if (scope.options.trigger) {
          var styleDefaults = {
            warning: {color: '#B71C1C', icon: 'alert:warning', title: 'Warning!'},
            info: {color: '#0D47A1', icon: 'action:info'},
            success: {color: '#1B5E20', icon: 'action:check_circle', title: 'Success!'},
            other: {color: '#E65100', icon: scope.options.icon || 'action:stars'},
            custom: {color: scope.options.color || '#263238', icon: scope.options.icon || 'action:thumb_up'}
          };

          scope.dirOptions = {
            background: styleDefaults[scope.options.style].color,
            icon: styleDefaults[scope.options.style].icon,
            title: styleDefaults[scope.options.style].title
          };

          console.log('dirOptions', scope.dirOptions);
          scope.showToast = true;

          $timeout(function () {
            scope.showToast = false;
          }, scope.options.timeout || 3500);
        }

      }
    };
  }
]);
