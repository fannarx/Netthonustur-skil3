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
    $http.get('http://localhost:5000/api/es/kodemon').success(function  (data) {
    	$scope.data = data;
    	console.log('GET: /kodemon');
    	console.log(data);
    	console.log('RESP: /kodemon');
    });

    $http.post('http://localhost:5000/api/es/kodemon/key.py/timerange', {startTime: '2014-10-29T19:30:00', endTime: '2014-10-29T19:59:10'}).success( function  (data) {
    	console.log('POST: /kodemon/key.py/timerange');
    	console.log(data);
    	console.log('RESP: /kodemon/key.py/timerange');
    });

    

  });
