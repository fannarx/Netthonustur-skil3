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
    
    //	Route: /api/es/kodemon/:project 
  	$http.get('http://localhost:5000/api/es/kodemon').success(function(data){
  		$scope.project = data;
  		console.log(data);
  	}).error(function(error){
  		console.log(error);
  	});
	//	Route: /api/es/kodemon/:project/:function
  
  	$scope.getFunctionValues = function(i){
  			//	Route: /api/es/kodemon/:project/:function/timerange
		    $http.post('http://localhost:5000/api/es/kodemon/func/timerange', {
		    	startTime: '2014-10-10T19:30:00',
		    	endTime: '2014-10-30T19:59:10', 
		    	fu: i
		    }).success( function  (data) {
		    	console.log('POST: /kodemon/key.py/timerange');
		    	console.log(data);
		    	$scope.timerange = data;
		    	console.log('RESP: /kodemon/key.py/timerange');
		    });
  	};
	

});
