'use strict';

angular.module('portfolioApp')
  	.config(function ($stateProvider) {
    	$stateProvider
      		.state('main', {
        		url: '/',
        		templateUrl: 'app/main/main.html',
        		controller: 'MainCtrl',
        		controllerAs: 'mainVm'
      		})
      		.state('about', {
      			url: '/about',
        		templateUrl: 'app/about/about.html',
        		controller: 'AboutCtrl',
        		controllerAs: 'ac'
      		})
      		.state('blog', {
      			url: '/blog',
        		templateUrl: 'app/blog/blog.html',
        		controller: 'BlogCtrl',
        		controllerAs: 'bc'
      		})
      		.state('contact', {
      			url: '/contact',
        		templateUrl: 'app/contact/contact.html',
        		controller: 'ContactCtrl',
        		controllerAs: 'cc'
      		})
      		.state('fun', {
      			url: '/fun',
        		templateUrl: 'app/fun/fun.html',
        		controller: 'FunCtrl',
        		controllerAs: 'fc'
      		})
      		.state('projects', {
      			url: '/projects',
        		templateUrl: 'app/projects/projects.html',
        		controller: 'ProjectsCtrl',
        		controllerAs: 'pc'
      		})
      		.state('resume', {
      			url: '/resume',
        		templateUrl: 'app/resume/resume.html',
        		controller: 'ResumeCtrl',
        		controllerAs: 'rc'
      		})
      		.state('social', {
      			url: '/social',
        		templateUrl: 'app/social/social.html',
        		controller: 'SocialCtrl',
        		controllerAs: 'sc'
      		})
          .state('2048', {
            url: '/fun/2048',
            templateUrl: 'app/fun/2048/2048.html',
            controller: 'Ng2048Ctrl',
            controllerAs: 'tfec'
          }).state('rrr', {
            url: '/fun/rrr',
            templateUrl: 'app/fun/rrr/rrr.html',
            controller: 'RrrCtrl',
            controllerAs: 'rrrc'
          });
  	});