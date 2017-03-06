'use strict';

angular.module('portfolioApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        controllerAs: 'mainVm',
        title: 'Joey Gauthier - Home'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'ac',
        title: 'Joey Gauthier - About'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'app/blog/blog.html',
        controller: 'BlogCtrl',
        controllerAs: 'bc',
        title: 'Joey Gauthier - Blog'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/contact/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'cc',
        title: 'Joey Gauthier - Contact'
      })
      .state('fun', {
        url: '/fun',
        templateUrl: 'app/fun/fun.html',
        controller: 'FunCtrl',
        controllerAs: 'fc',
        title: 'Joey Gauthier - Fun Stuff'
      })
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/projects/projects.html',
        controller: 'ProjectsCtrl',
        controllerAs: 'pc',
        title: 'Joey Gauthier - Projects'
      })
      .state('resume', {
        url: '/resume',
        templateUrl: 'app/resume/resume.html',
        controller: 'ResumeCtrl',
        controllerAs: 'rc',
        title: 'Joey Gauthier - Resume'
      })
      .state('social', {
        url: '/social',
        templateUrl: 'app/social/social.html',
        controller: 'SocialCtrl',
        controllerAs: 'sc',
        title: 'Joey Gauthier - Social'
      })
      .state('2048', {
        url: '/fun/2048',
        templateUrl: 'app/fun/2048/2048.html',
        controller: 'Ng2048Ctrl',
        controllerAs: 'tfec',
        title: 'Phangular 2048'
      })
      .state('rrr', {
        url: '/fun/rrr',
        templateUrl: 'app/fun/rrr/rrr.html',
        controller: 'RrrCtrl',
        controllerAs: 'rrrc',
        title: 'Restaurant Roulette Remix'
      })
      .state('rrr.main', {
        parent: 'rrr',
        templateUrl: 'app/fun/rrr/templates/main.html',
        title: 'Restaurant Roulette Remix'
      })
      .state('rrr.options', {
        parent: 'rrr',
        templateUrl: 'app/fun/rrr/templates/options.html',
        title: 'Restaurant Roulette Remix'
      })
      .state('rrr.results', {
        parent: 'rrr',
        templateUrl: 'app/fun/rrr/templates/results.html',
        title: 'Restaurant Roulette Remix'
      })
      .state('rrr.directions', {
        parent: 'rrr',
        templateUrl: 'app/fun/rrr/templates/directions.html',
        title: 'Restaurant Roulette Remix'
      })
      .state('rrr.manual', {
        parent: 'rrr',
        templateUrl: 'app/fun/rrr/templates/manual.html',
        title: 'Restaurant Roulette Remix'
      })
      .state('games', {
        url: '/games',
        templateUrl: 'app/vg/games.html',
        controller: 'GamesCtrl',
        controllerAs: 'gc'
      })
      .state('gameslogin', {
        url: '/games/login',
        templateUrl: 'app/vg/crud/login.html',
        controller: 'GamesLoginCtrl',
        controllerAs: 'glc'
      })
      .state('gameseditor', {
        url: '/games/editor',
        templateUrl: 'app/vg/crud/editor.html',
        controller: 'GamesEditorCtrl',
        controllerAs: 'gec'
      })
      .state('gameseditor.gamesLib', {
        parent: 'gameseditor',
        onEnter: function ($rootScope, $timeout, $stateParams) {
          // $timeout(function() {
          //   $rootScope.$broadcast('gameslib');
          // });
        },
        url: '/gameslib',

        views: {
          'gamesLib': {
            controller: 'EditGamesLibCtrl',
            templateUrl: 'app/vg/crud/gamesLib/gamesEditorGamesLib.html',
            controllerAs: 'eglc'
          }
        }
      })
      .state('gameseditor.hwLib', {
        parent: 'gameseditor',
        onEnter: function ($rootScope, $timeout, $stateParams) {
          // $timeout(function() {
          //   $rootScope.$broadcast('gameslib');
          // });
        },
        url: '/hwlib',
        views: {
          'hwLib': {
            templateUrl: 'app/vg/crud/hwLib/gamesEditorHwLib.html',
            controller: 'EditHwLibCtrl'
          }
        }

      })
      .state('gameseditor.gameWl', {
        parent: 'gameseditor',
        onEnter: function ($rootScope, $timeout, $stateParams) {
          // $timeout(function() {
          //   $rootScope.$broadcast('gameslib');
          // });
        },
        url: '/gameswl',
        views: {
          'gamesWl': {
            templateUrl: 'app/vg/crud/gamesWl/EditGameWl.html',
            controller: 'EditGamesWlCtrl',
            controllerAs: 'egwl'
          }
        }

      })
      .state('gameseditor.conWl', {
        parent: 'gameseditor',
        onEnter: function ($rootScope, $timeout, $stateParams) {
          // $timeout(function() {
          //   $rootScope.$broadcast('gameslib');
          // });
        },
        url: '/conWl',
        views: {
          'conWl': {
            templateUrl: 'app/vg/crud/conWl/EditConWl.html',
            controller: 'EditConWlCtrl'
          }
        }

      });
  });
