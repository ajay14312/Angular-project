'use strict';

/**
 * @ngdoc overview
 * @name earthAngularProject
 * @description # earthAngularProject
 *
 * Main module of the application.
 */
(function(){
	'use strict';
	var app = angular.module('earthAngularProject', ['ui.router',"angular-loading-bar"]);
	
	app.config(function($stateProvider, $urlRouterProvider, ){
		
		$urlRouterProvider.otherwise('/');
		
		$stateProvider.state('home',{
			url: '/',
			template: '<home-component test="$resolve.test"></home-component>'
		})
		$stateProvider.state('javascript', {
			url: '/javascript',
			template: '<language-component languagedata = "$resolve.languagedata"></language-component>',
			resolve: {
				languagedata: function ($state$, languageService){
					return languageService.load('repositories',$state$.name);
				}
			}
		});
		$stateProvider.state('java', {
			url: '/java',
			template: '<language-component languagedata = "$resolve.languagedata"></language-component>',
			resolve: {
				languagedata: function ($state$, languageService){
					return languageService.load('repositories',$state$.name);
				}
			}
		});
		$stateProvider.state('python', {
			url: '/python',
			template: '<language-component languagedata = "$resolve.languagedata"></language-component>',
			resolve: {
				languagedata: function ($state$, languageService){
					return languageService.load('repositories',$state$.name);
				}
			}
		});
		$stateProvider.state('php', {
			url: '/php',
			template: '<language-component languagedata = "$resolve.languagedata"></language-component>',
			resolve: {
				languagedata: function ($state$, languageService){
					return languageService.load('repositories',$state$.name);
				}
			}
		});
		$stateProvider.state('ruby', {
			url: '/ruby',
			template: '<language-component languagedata = "$resolve.languagedata"></language-component>',
			resolve: {
				languagedata: function ($state$, languageService){
					return languageService.load('repositories',$state$.name);
				}
			}
		});
		$stateProvider.state('users', {
			url: '/users/:userId',
			template: '<user-component></user-component>'
		});
	})
	app.component('navBar',{
		templateUrl: './views/nav-bar.html'
	})
	app.component('homeComponent',{
		templateUrl: './views/home-component.html'
	})
	app.component('languageComponent',{
		templateUrl: './views/language.html',
		bindings: {  languagedata: '<' },
		controller: function languageComponent($state, languageService){
			var vm = this;
			vm.stateName = $state.$current.name;
			vm.$onInit = function(){
			vm.languageRes = vm.languagedata;	
			}
		}
	})
	
	app.component('userComponent',{
		templateUrl: './views/user.html',
		controller: function userComponent($stateParams, languageService, paginationService, $location){
			var vm = this;
			vm.users = 'users'
			vm.paramName = $stateParams.userId;
			vm.overview = true;
			if(vm.paramName === "" || vm.paramName === undefined){
				$location.path('/');
				return;
			}
			languageService.load(vm.users,vm.paramName).then(response =>{
				vm.userRepoData = response.items[0];
				languageService.getUserRepoData(vm.userRepoData.repos_url).then(response => {
					vm.userRepos = response;
				})
				languageService.getUserRepoData(vm.userRepoData.url).then(response => {
					vm.userReposDetails = response;
					vm.userReposLength = vm.userReposDetails.public_repos;
					vm.userFollowersLength = vm.userReposDetails.followers;
					vm.userFollowingLength = vm.userReposDetails.following;
					vm.userReposUrl = vm.userReposDetails.repos_url;
					vm.userFollowersUrl = vm.userReposDetails.followers_url;
					vm.userFollowingUrl = vm.userReposDetails.following_url.split('{')[0];
				})
				
			});
			
			vm.userNavData = (type) => {
				if(type === 'repos'){
					vm.usersearchType = type;
					vm.repos = true;
					vm.overview = vm.stars = vm.followers = vm.following = false;
					if(vm.userReposLength >0){
						vm.initController(vm.userReposLength);
					}
				} else if(type === 'overview'){
					vm.usersearchType = type;
					vm.overview = true;
					vm.repos = vm.stars = vm.followers = vm.following = false;
					languageService.getUserRepoData(vm.userRepoData.repos_url).then(response => {
						vm.userRepos = response;
					})
					if(vm.pager){vm.pager.pages = '';}
				}else if(type === 'stars'){
					vm.usersearchType = type;
					vm.stars = true;
					vm.overview = vm.repos = vm.followers = vm.following = false;
					if(vm.userReposLength >0){
						vm.initController(vm.userReposLength);
					}
				} else if(type === 'followers'){
					vm.usersearchType = type;
					vm.followers = true;
					vm.overview = vm.stars = vm.repos = vm.following = false;
					if(vm.userFollowersLength > 0){
						vm.initController(vm.userFollowersLength);
					}
				} else if(type === 'following') {
					vm.usersearchType = type;
					vm.following = true;
					vm.overview = vm.stars = vm.followers = vm.repos = false;
					if(vm.userFollowingLength > 0){
						vm.initController(vm.userFollowingLength);
					}
				}
			}
			
			vm.matchsearchByStarCount = (input) => {
			  return vm.userRepos.filter(function(userRepo) {
				if (userRepo.stargazers_count > input){
				  return userRepo;
				}
			  });
			};
			
			vm.initController = (rangeCount) => {
				vm.dummyItems = _.range(1, rangeCount);
				vm.pager = {};
				vm.setPage(1);
			}

			vm.setPage = (page) => {
				if (page < 1 || page > vm.pager.totalPages) {
					return;
				}
				if(vm.usersearchType === 'repos' || vm.usersearchType === 'stars'){
					var url = vm.userReposUrl+'?per_page=9&page='+page;
					languageService.getUserRepoData(url).then(response => {
						vm.userRepos = response;
						if(vm.usersearchType === 'stars'){
							vm.userRepos = vm.matchsearchByStarCount(0);
						}
					})
				}
				if(vm.usersearchType === 'followers'){
					var url = vm.userFollowersUrl+'?per_page=9&page='+page;
					languageService.getUserRepoData(url).then(response => {
						vm.userFollowers = response;
					})
				}
				if(vm.usersearchType === 'following'){
					var url = vm.userFollowingUrl+'?per_page=9&page='+page;
					languageService.getUserRepoData(url).then(response => {
						vm.userFollowing = response;
					})
				}
				// get pager object from service
				vm.pager = paginationService.GetPager(vm.dummyItems.length, page);

				// get current page of items
				vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
			}
		}
	})
	
	app.service('languageService',function($http){
		var userRepoData = {};
		this.load = function(common,userReposlisting) {
			return $http({
				url: 'https://api.github.com/search/'+common+'?q='+userReposlisting,
				method: 'GET'
			}).then(this.successCallback, this.errorCallback);
		}
		
		this.getUserRepoData = function(url){
			return $http({
				url: url,
				method: 'GET'
			}).then(this.successCallback, this.errorCallback);
		}
		
		this.successCallback =  function(response) {
				userRepoData = response.data;
				return userRepoData;
		};
			
		this.errorCallback =  function(response) {
			userRepoData = response.data;
			return userRepoData;
		};
	})
	
	app.service('paginationService', function(){
		var service = {};

        service.GetPager = GetPager;

        return service;

        // service implementation
        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 9;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
	})
	app.directive('showDuringResolve', function($rootScope) {

	  return {
		link: function(scope, element) {

		  element.addClass('ng-hide');

		  var unregister = $rootScope.$on('$routeChangeStart', function() {
			element.removeClass('ng-hide');
		  });

		  scope.$on('$destroy', unregister);
		}
	  };
	});
})();
