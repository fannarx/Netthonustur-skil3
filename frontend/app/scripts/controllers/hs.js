'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HsCtrl', function ($scope, $http) {

    //	Route: /api/es/kodemon/:project
    // $http.post('http://localhost:5000/api/es/kodemon' ,{field: 'key.py-mainFunction'}).success(function  (data) {
    // 	$scope.project = data;
    // 	console.log('GET: /kodemon');
    // 	console.log(data);
    // 	console.log('RESP: /kodemon');
    // });

	//	Route: /api/es/kodemon/:project/:function
    // $http.get('http://localhost:5000/api/es/kodemon/func').success(function  (data) {
    // 	console.log('POST: /kodemon/func');
    // 	//console.log(data);
    // 	$scope.functon = data;
    // 	console.log('RESP: /kodemon/func');
    // });


	//	Route: /api/es/kodemon/:project/:function/timerange
    $http.get('http://localhost:5000/api/ess/kodemon', {
    }).success( function  (data) {
    	console.log('POST: /kodemon/key.py/timerange');
    	console.log(data);
    	$scope.timerange = data;
    	console.log('RESP: /kodemon/key.py/timerange');
    }).error(function (err, data){
        console.log(err);
    });

});
