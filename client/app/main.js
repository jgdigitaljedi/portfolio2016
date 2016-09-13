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
      		});
  	});