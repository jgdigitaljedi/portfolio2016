'use strict';
/*jshint camelcase: false */

angular.module('portfolioApp').controller('ProjectsCtrl', ['$rootScope', '$scope', 'Dataobjects', '$mdDialog', '$timeout', '$http', '$compile',
	function ($rootScope, $scope, Dataobjects, $mdDialog, $timeout, $http, $compile) {
		var pc = this,
			projects,
			cLen;
		pc.theme = $rootScope.theme;
		pc.showLabel = true;

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
					pc.projects[project].tile = '../../assets/images/no-image.png';
				}				
			}
		}

		pc.changeProjectSet = function () {
			pc.isPersonal = !pc.isPersonal;
			pc.whichProjects = pc.isPersonal ? 'personal' : 'work';
			makeProjectGrid();
		};

		pc.openProject = function (which) {
			pc.showLabel = false;
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
						pc.showLabel = true;
                        $mdDialog.cancel();
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

		function gitHubWidget () {
			$http({
	            method: 'GET',
	            url: '/api/proxy/mygithub'
	        }).then(function successCallback (response) {
	            var rLen = response.data.length;
	            for (var i = 0; i < rLen; i++) {
	                var tooltipString = 'Language: ' + (response.data[i].language ? response.data[i].language : 'Unknown') + 
	                        ' / Last Updated: ' + moment(response.data[i].updated_at).format('MM/DD/YYYY hh:mm a'),
	                    template = $compile('<md-button ng-click="openGhProject(\'' + response.data[i].html_url + 
	                        '\')" class="op-entry"><span>' + response.data[i].name + 
	                        '</span><md-tooltip style="color: black; font-size: 1.1em;">' + tooltipString + '</md-tooltip></md-button>')($scope);
	                angular.element(document.querySelector('.op-area')).append(template);
	            }
	        }, function errorCallback (response) {
	            console.log('github info', response);
	        });			
		}

		(function () {
			projects = Dataobjects.getProjects();
			pc.colors = Dataobjects.getMaterialColors();
			cLen = pc.colors.length;
			pc.whichProjects = 'personal';
			pc.isPersonal = true;
			makeProjectGrid();
			gitHubWidget();
		})();
	}
]);