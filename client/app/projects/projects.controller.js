'use strict';

angular.module('portfolioApp').controller('ProjectsCtrl', ['$rootScope', 'Dataobjects', '$mdDialog', '$timeout',
	function ($rootScope, Dataobjects, $mdDialog, $timeout) {
		var pc = this,
			projects,
			cLen;
		pc.theme = $rootScope.theme;

		$rootScope.$on('theme change', function () {
		    pc.theme = $rootScope.theme;
		});

		function getRandomColor () {
			return pc.colors[Math.floor(Math.random() * cLen)];
		}

		function makeProjectGrid () {
			pc.projects = projects[pc.whichProjects];
			if (pc.whichProjects === 'work') {
				for (var project in pc.projects) {
					pc.projects[project].color = getRandomColor();
				}				
			}
		}

		pc.changeProjectSet = function () {
			pc.isPersonal = !pc.isPersonal;
			pc.whichProjects = pc.isPersonal ? 'personal' : 'work';
			makeProjectGrid();
		};

		pc.openProject = function (which) {
			var selectedProject = pc.projects[which];
			console.log('which', selectedProject);
			$mdDialog.show({
                controller: function GalleryController($scope, $mdDialog) {
                	$scope.theme = pc.theme;
                    $scope.which = selectedProject;
                    var thumbs = document.getElementsByClassName('film-square');

                    if($scope.which.images) {
                        $scope.selectedPic = selectedProject.images[0];
                    }

                    $scope.closeGallery = function () {
                        angular.element(document.body).addClass('no-scroll');
                        $mdDialog.cancel();
                        $timeout(function() {
                            angular.element(document.body).removeClass('no-scroll');
                        }, 750);
                        //angular.element(document.body).css('overflow', 'auto');
                    };

                    $scope.changePic = function (e, picPath) {
                        angular.element(thumbs).removeClass('selected-thumb');
                        angular.element(e.target).addClass('selected-thumb');
                        angular.element(document.querySelector('.big-pic')).removeClass('fade-in');
                        $timeout(function () {
                            angular.element(document.querySelector('.big-pic')).addClass('fade-in');
                        }, 30);
                        $scope.selectedPic = picPath;
                    };
                },
                templateUrl: '/app/projects/modals/project.modal.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
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