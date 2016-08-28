'use strict';

var homeValApp = angular.module('homeValApp', ['ngRoute', 'ngMaterial', 'ngResource']);

homeValApp.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
		when('/homeVal', {
			templateUrl: 'client/components/homeVal/homeVal.html',
			controller: 'MainController'
		}).
        otherwise({
            redirectTo: '/homeVal'
        })
	}]);

homeValApp.controller('MainController', ['$scope', '$rootScope', '$resource', '$location',
	function($scope, $rootScope, $resource, $location){
		$scope.main = {};
		$scope.main.place;

		
	}])





