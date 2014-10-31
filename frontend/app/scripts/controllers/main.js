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
		    	startTime: $scope.startDay,
		    	endTime: $scope.endDay, 
		    	fu: i
		    }).success( function  (data) {
		    	console.log('POST: /kodemon/key.py/timerange');
		    	console.log(data);
		    	$scope.timerange = data;
		    	console.log('RESP: /kodemon/key.py/timerange');
		    });
  	};


$scope.sDay = function() {
    $scope.startDay = new Date();
  };


$scope.eDay = function() {
    $scope.endDay = new Date();
  };
  
  $scope.sDay();
  $scope.eDay();

  $scope.clear = function () {
    $scope.startDay = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

    $scope.disabledEnd = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

	$scope.open = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();
    	$scope.opened = true;
  };

  $scope.openEnd = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();
    	$scope.openedEnd = true;
  };


  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd-MMMM-yyyy';


});