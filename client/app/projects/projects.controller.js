'use strict';

angular.module('portfolioApp').controller('ProjectsCtrl', ['$rootScope', 'Dataobjects',
	function ($rootScope, Dataobjects) {
		var pc = this,
			projects,
			cLen;
		pc.theme = $rootScope.theme;

		$rootScope.$on('theme change', function () {
		    pc.theme = $rootScope.theme;
		});

		pc.getRandomColor = function () {
			return pc.colors[Math.floor(Math.random() * cLen)];
		};

		function makeProjectGrid () {
			pc.projects = projects[pc.whichProjects];
			console.log('pc.projects', pc.projects);
		}

		pc.changeProjectSet = function () {
			pc.isPersonal = !pc.isPersonal;
			pc.whichProjects = pc.isPersonal ? 'personal' : 'work';
			makeProjectGrid();
		};

		(function () {
			projects = Dataobjects.getProjects();
			pc.colors = Dataobjects.getMaterialColors();
			cLen = pc.colors.length;
			pc.whichProjects = 'personal';
			pc.isPersonal = true;
			makeProjectGrid();
		})();
	}
]);