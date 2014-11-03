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
    // ## Variable declerations.
    var url = 'http://localhost:5000/api/es/kodemon/';
	$scope.BarChartSeries = [];
	// ##
	
	// ## Http calls.
 	$http.get(url + 'loadtime/desc').success(function(data){
  		$scope.highestLoadTime = data;
  		}).error(function(error){
  		console.log(error);
  	});
 	
 	$http.get(url+'loadtime/asc').success(function(data){
  		$scope.lowestLoadTime = data;
  		}).error(function(error){
  		console.log(error);
  	});

	$http.get(url+'loadtime/allfiles/average').success(function(data){
			$scope.averageLoadTime = data;
	  		}).error(function(error){
	  		console.log(error);
	  	});

	$http.get(url).success(function(data){
		$scope.project = data;
		for(var item in data){
			$scope.BarChartSeries.push({'data': [data[item].doc_count], 'name': data[item].key});	
		}
		}).error(function(error){
			console.log(error);
	});

	$scope.getFilesByTimerange = function(){
            $http.post(url+'timerange', {
                startTime: $scope.startDay,
                endTime: $scope.endDay,
            }).success( function  (data) {
            	$scope.filesByTimerange = data;
            	console.log(data);
            });
    };


	// ##

	// ## Chart setup.
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
	// ##

// ## Date Time selector.
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
// ## DateTime selection end.
});
