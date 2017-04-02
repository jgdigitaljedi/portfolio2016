'use strict';

//**********************************************************
//** semi-material style toast directive
//** written by Joey Gauthier
//** Gluten-free because I have celiac and can't eat toast
//**********************************************************
// var scripts = document.getElementsByTagName("script")
// var currentScriptPath = scripts[scripts.length-1].src;
// console.log('cs path', currentScriptPath);

angular.module('portfolioApp').directive('gfToast', ['$timeout', '$window',
  function ($timeout, $window) {
    return {
      restrict: 'AE',
      // transclude: true,
      templateUrl: 'components/directives/glutenFreeToast.directive.html',
      scope: {
        options: '='
      },
      link: function (scope, elem, attrs) {

        function triggerToast () {
          if (scope.options.trigger) {
            elem.addClass('gf-position');
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

            scope.showToast = true;
            if (scope.options.scrollContainer) {
              var scroller = angular.element(document.querySelector(scope.options.scrollContainer)),
                topScroll = scroller[0].scrollTop;

              $('.gf-toast-wrapper').css('bottom', 8 - topScroll + 'px');
            }

            $timeout(function () {
              // debugger;
              elem.removeClass('gf-position');
              scope.showToast = false;
            }, scope.options.timeout || 3500);

            $timeout(function () {
              scope.options.trigger = false;
            }, 5000);
          }
        }

        triggerToast();
      //   scope.$watch('scope.options', function () {
      //     triggerToast();
      //   });
      }
    };
  }
]);
