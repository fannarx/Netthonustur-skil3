'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $http, $interval, $filter,$routeParams) {
    var url = 'http://localhost:5000/api/es/kodemon/';
    /*	#### Pritty'fy modification ! */

$scope.BarChartSeries = [];
  
  $scope.toggleHighCharts = function () {
    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks;
  };

  $scope.barChartConfig = {
    options: {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        series: {
          stacking: ''
        }
      }
    },
    series: $scope.BarChartSeries,
    title: {
      text: 'All files for Kodmon project'
    },
    xAxis:{
      labels:{
        format: '# function Calls'
      }
    },
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  };


/*	#### Pritty'fy modification ! END END END END END END END END END END */



  	$http.get(url).success(function(data){
  		$scope.project = data;
  		console.log(data);
  		for(var item in data){
  			$scope.BarChartSeries.push({'data': [data[item].doc_count], 'name': data[item].key});	
  		}
  		
  	}).error(function(error){
  		console.log(error);
  	});


  	$scope.getAllFunctionsByFile = function(i){
  		$http.get(url + i).success(function (data){
  			$scope.functionByFileContainer = data.aggregations.group_by_functions.buckets;
  			console.log(data);
  		}).error(function(error){
  			console.log(error);
  		});
  	};

  	$scope.getAllFunctionCalls = function(i){
  		$http.get(url +'getsome/'+ i.key).success(function(data){
  			$scope.functionCallsContainer = data.hits.hits;
  			console.log(data);
  		}).error(function(error){
  			console.log(error);
  		});
  	};




	//	Route: /api/es/kodemon/:project/:function

  	$scope.getFunctionValuesByTimerange = function(i){
  			//	Route: /api/es/kodemon/:project/:function/timerange
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
