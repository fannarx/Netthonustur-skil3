'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('FuncCtrl', function ($scope, $http, $routeParams, $interval, $filter) {
    var url = 'http://localhost:5000/api/es/kodemon/'+$routeParams.file+'/'+$routeParams.function;
    $scope.functionName = $routeParams.function;
    var executionTime = [],
    timestamp = [],
    maxTest,
    minTest;

    //	Route: /api/es/kodemon/:project 
  		$http.get(url).success(function(data){
  			$scope.functionCallsContainer = data.hits.hits;
        extractChartData(data.hits.hits);
  			console.log(data);
  		}).error(function(error){
  			console.log(error);
  		});

  	$scope.getFunctionValues = function(i){
		    $http.post('http://localhost:5000/api/es/kodemon/func', {
		    	fu: i
		    }).success( function  (data) {
		    	console.log('POST: /kodemon/key.py/timerange');
		    	console.log(data);
		    	$scope.timerange = data;
		    	console.log('RESP: /kodemon/key.py/timerange');
		    });
  	};
    
    var sTime = new Date();
    sTime.setDate(sTime.getDate()-3);

    $filter('date')(sTime, 'yyyy-MM-dd:hh:mm:ss');
    
    $scope.getNew = function(){
      console.log('calling getNew');
      console.log(sTime);
      console.log((new Date()));
      $http.post('http://localhost:5000/api/es/kodemon/file/timerange', {
          startTime: sTime,
          endTime: new Date(), 
          fu: $scope.functionName
        }).success( function  (data) {
          extractChartData(data);
          sTime = new Date();
          $filter('date')(sTime, 'yyyy-MM-dd:hh:mm:ss');
        });
    };

    function extractChartData(data){
        for (var i = data.length - 1; i >= 0; i--) {
          executionTime.push(data[i]._source.execution_time);
          timestamp.push(data[i]._source.timestamp);
        };
    };


$interval(function() {
        $scope.getNew();
        }, 3000);

// ##### HIGHCHARTS EXPEREMENT


  // $scope.chartTypes = [
  //   {"id": "line", "title": "Line"}
  // ];

  // $scope.dashStyles = [
  //   {"id": "Solid", "title": "Solid"}
  // ];

  $scope.chartSeries = [
    {"name": "Execution times for "+$scope.functionName, "data": executionTime}
  ];

  // $scope.chartStack = [
  //   {"id": '', "title": "No"},
  //   {"id": "normal", "title": "Normal"},
  //   {"id": "percent", "title": "Percent"}
  // ];

  $scope.toggleHighCharts = function () {
    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
  }


  $scope.chartConfig = {
    options: {
      chart: {
        type: 'line'
      },
      plotOptions: {
        series: {
          stacking: 'derp'
        }
      }
    },
    series: $scope.chartSeries,
    title: {
      text: 'Time chart for '+$scope.functionName
    },
    //xAxis: {'type': 'datetime', 'dateTimeLabelFormats': {'day':'%e of %b'}},
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  };

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };

});

