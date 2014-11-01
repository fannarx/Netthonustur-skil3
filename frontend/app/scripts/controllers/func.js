'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('FuncCtrl', function ($scope, $http, $routeParams) {
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
  			//	Route: /api/es/kodemon/:project/:function/timerange
		    $http.post('http://localhost:5000/api/es/kodemon/func', {
		    	fu: i
		    }).success( function  (data) {
		    	console.log('POST: /kodemon/key.py/timerange');
		    	console.log(data);
		    	$scope.timerange = data;
		    	console.log('RESP: /kodemon/key.py/timerange');
		    });
  	};


    function extractChartData(data){
        for (var i = data.length - 1; i >= 0; i--) {
          executionTime.push(data[i]._source.execution_time);
          timestamp.push(data[i]._source.timestamp);
        };
        console.log(timestamp);
        console.log(executionTime);
    };
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
  }

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };










});
