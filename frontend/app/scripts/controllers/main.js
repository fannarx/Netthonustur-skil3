'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $http, $interval, $filter) {
    var url = 'http://localhost:5000/api/es/kodemon/',
    /*	#### Pritty'fy modification ! */
    // Set all variables.
    	sTime = new Date();
    	sTime.setDate(sTime.getDate()-3);
    	$filter('date')(sTime, 'yyyy-MM-dd:hh:mm:ss');
    var	functionList = 
    		 {
    		 	'funny': { 'data':[0], 'updateTime': sTime },
    		 	'mainFunction': { 'data':[0], 'updateTime': sTime } 
    		 };

    var getLatestData = $interval(function() { $scope.getLatestKodmonData(); }, 100);
   
    
    $scope.getLatestKodmonData = function(){
    	for (var x in functionList){
    		queryApi(functionList[x], x);
    	}
    };

    function queryApi(i, fun){
	$http.post('http://localhost:5000/api/es/kodemon/file/timerange', {
	          startTime: i.updateTime,
	          endTime: new Date(), 
	          fu: fun
	        }).success( function  (data) {
	          // if there is no new data, we dont need to extract and resett timer.
	          if(data[0]){
	          	extractChartData(data, fun);
	          	i.updateTime = new Date();
	          	$filter('date')(i.updateTime, 'yyyy-MM-dd:hh:mm:ss');
	          }
	        });
    }


    function extractChartData(datax,i){
        for(var x in datax){
        	functionList[i].data.push(datax[x]._source.execution_time);
        }
    }

    $scope.$on('$destroy', function(){
        $interval.cancel(getLatestData);
    });




// ##### HIGHCHARTS EXPEREMENT


  $scope.chartSeries = [];
  
  for(var item in functionList){
  	$scope.chartSeries.push(functionList[item]);
  }

  $scope.toggleHighCharts = function () {
    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks;
  };

  $scope.chartConfig = {
    options: {
      chart: {
        type: 'line'
      },
      plotOptions: {
        series: {
          stacking: ''
        }
      }
    },
    series: $scope.chartSeries,
    title: {
      text: 'Time chart for '
    },
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  };

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };







/*	#### Pritty'fy modification ! END END END END END END END END END END */

































  	$http.get(url).success(function(data){
  		$scope.project = data;
  		console.log(data);
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
