'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('FileCtrl', function ($scope, $http, $routeParams, $filter, $interval) {
  // ## Setup variables.
  $scope.file = $routeParams.file;
  $scope.loadingChart = true;
  $scope.chartSeries = [];
  $scope.chartTimeSeries = [];
  var url = 'http://localhost:5000/api/es/kodemon/'+ $scope.file,
      sTime = new Date(),
      getLatestData = $interval(function() { $scope.getLatestKodmonData(); }, 1000),    // ## Calls the api with the interval of 1sec.
      functionList = [{'item':{'function': 'nan', 'data':[0], 'updateTime': sTime } }]; // ## Sets one dummy item in to the functionList to 'hax' the
                                                                                        // ## Javascript to work with the bar data correctly.
  sTime.setDate(sTime.getDate()-3);                                                     // ## Set the time -3days from now. to get some content for the
  $filter('date')(sTime, 'yyyy-MM-dd:hh:mm:ss');                                        // ## Live data feed chart.

  // ## Variable's end.

  // ## Query functions.
  $http.get(url).success(function (data){
    $scope.functionByFileContainer = data.aggregations.group_by_functions.buckets;
    setupFunctionList($scope.functionByFileContainer);
    $scope.chartConfig.loading = !$scope.chartConfig.loading;
    $scope.selectedFunction = $scope.functionByFileContainer[0];
  }).error(function(error){
    console.log(error);
  });

  $scope.getLatestKodmonData = function(){                                              // ## Query the api for the latest data on every function listed
    for (var x in functionList){                                                        // ## in the function list.
      queryApi(functionList[x].item);
    }
  };

function queryApi(item){
      $http.post(url+'/timerange', {
        startTime: item.updateTime,
        endTime: new Date(),
        fu: item.function
      }).success( function  (data) {
        if(data[0]){                                                                    // ## If there is not data in the request we dont want to update
          extractChartData(data, item);                                                 // ## the chart data and the time request.
          item.updateTime = new Date();
          $filter('date')(item.updateTime, 'yyyy-MM-dd:hh:mm:ss');
        }
      });
  }
$scope.getFunctionValuesByTimerange = function(i){
      $http.post(url+'/timerange', {
        startTime: $scope.startDay,
        endTime: $scope.endDay,
        fu: i.key
      }).success( function  (data) {
        var tmp = [];
        for(var item in data){
            tmp.push(data[item]._source.execution_time);
        }
        $scope.chartTimeSeries.push({'name': i.key ,'data':tmp, 'start': $scope.startDay});
        $scope.functionCallsFilteredByFunctionAndTimeContainer = data;
      });
  };

  // ## Query functions end.


  function extractChartData(apiRespData,functionListItem){                              // ## Parse the data from the request and push it to the function
      for(var x in apiRespData){                                                        // ## List.
        functionListItem.data.push(apiRespData[x]._source.execution_time);
      }
  }


  // ## Chart setup.
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
      text: 'Real time chart for ' + $routeParams.file
    },
    yAxis:{
      labels:{
        format: '{value} Nano sec'
      }
    },
    credits: {
      enabled: true
    },
    loading: true,
    size: {}
  };

  $scope.chartTimeConfig = {
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
    series: $scope.chartTimeSeries,
    title: {
      text: 'Time chart for ' + $routeParams.file
    },
    yAxis:{
      labels:{
        format: '{value} Nano sec'
      }
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

  function setupFunctionList(data){
    for (var i = data.length - 1; i >= 0; i--) {
      var derp = {'item': { 'function': data[i].key, 'data':[0], 'updateTime': sTime, 'name': data[i].key }, 'id': data[i].key };
      functionList.push(derp);
      $scope.chartSeries.push(derp.item);

    }
  }

  $scope.removeTimeSeries = function(i){
        var seriesArray = $scope.chartTimeSeries;
        seriesArray.splice(i.id, 1);
  }

// ## Chart setup end.

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

$scope.$on('$destroy', function(){                                          // ## We have to cancel the bombarding of query' requests when the user
      $interval.cancel(getLatestData);                                      // ## navigates from the file interface.
  });

});
