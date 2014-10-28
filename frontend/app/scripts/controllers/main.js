'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.post('http://localhost:5000/api/search/key.py').success(function  (data) {
    	$scope.data = data;
    	console.log(data);
    });
  });
