'use strict';

var homeValApp = angular.module('homeValApp', ['ngRoute', 'ngMaterial', 'ngResource']);

homeValApp.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'components/login-register/login-registerTemplate.html',
			controller: 'MainController'
		})
	}]);

homeValApp.controller('MainController', ['$scope', '$rootScope', '$resource', '$location',
	function($scope, $rootScope, $resource, $location){
		$scope.main = {};

		

		
	}])





