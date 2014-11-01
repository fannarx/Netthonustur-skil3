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
    var url = 'http://localhost:5000/api/es/kodemon/';
    // Route: api/es/kodemon/
    $http.get(url).success(function(data){
        $scope.project = data;
        console.log('$scope.project:');
        console.log(data);
    }).error(function(error){
        console.log('ERROR: in GET:' + url);
        console.log (error);
    });

// HS
    //  Route: /api/es/:index/timerange
    //  Route example: /api/es/kodemon/timerange
    $scope.getFilesByTimerange = function(){
            //  Route: /api/es/kodemon/:project/:function/timerange
            console.log('### getFilesByTimerange ###');
 //           console.log(i);
            $http.post('http://localhost:5000/api/es/kodemon/timerange', {
                startTime: $scope.startDay,
                endTime: $scope.endDay,
  //               fu: i.key
            }).success( function  (data) {
                console.log('Response form elasticsearch when POST: /kodemon/timerange');
                console.log(data.aggregations);
                $scope.filesByDateRagnge = data.aggregations.groupByFiles.buckets;
                console.log('RESP: /kodemon/key.py/timerange');
            });
    };

// hs end



    //  Route: /api/es/kodemon/:project/:function

    $scope.getFunctionValuesByTimerange = function(i){
            //  Route: /api/es/kodemon/:project/:function/timerange
            console.log('### getFunctionValuesByTimerange ###');
        console.log(i);
            $http.post('http://localhost:5000/api/es/kodemon/func/timerange', {
                startTime: $scope.startDay,
                endTime: $scope.endDay,
                fu: i.key
            }).success( function  (data) {
                console.log('POST: /kodemon/key.py/timerange');
                console.log(data);
                $scope.functionCallsFilteredByFunctionAndTimeContainer = data;
                console.log('RESP: /kodemon/key.py/timerange');
            });
    };

    $scope.getFunctionValues = function(i){
            //  Route: /api/es/kodemon/:project/:function/timerange
            $http.post('http://localhost:5000/api/es/kodemon/func', {
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

});
