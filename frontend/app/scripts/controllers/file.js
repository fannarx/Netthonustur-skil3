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
    /**PRETTY FEYH*/
  $scope.file = $routeParams.file;
  var url = 'http://localhost:5000/api/es/kodemon/'+ $scope.file;
  $scope.loadingChart = true;
// Set all variables.
    var sTime = new Date();
      sTime.setDate(sTime.getDate()-3);
      $filter('date')(sTime, 'yyyy-MM-dd:hh:mm:ss');

    var functionList =
         [{
           'item':{'function': 'nan', 'data':[0], 'updateTime': sTime }
          }
         ];

    var getLatestData = $interval(function() { $scope.getLatestKodmonData(); }, 100);

    $scope.getLatestKodmonData = function(){
      for (var x in functionList){
        console.log(functionList[x].item);
        queryApi(functionList[x].item);
      }
    };

    function queryApi(item){
          $http.post('http://localhost:5000/api/es/kodemon/file/timerange', {
            startTime: item.updateTime,
            endTime: new Date(),
            fu: item.function
          }).success( function  (data) {
            // if there is no new data, we dont need to extract and resett timer.
            if(data[0]){
              extractChartData(data, item);
              item.updateTime = new Date();
              $filter('date')(item.updateTime, 'yyyy-MM-dd:hh:mm:ss');
            }
            console.log($scope.chartSeries);
          });
    }


    function extractChartData(apiRespData,functionListItem){
        for(var x in apiRespData){
          functionListItem.data.push(apiRespData[x]._source.execution_time);
        }
    }

    $scope.$on('$destroy', function(){
        $interval.cancel(getLatestData);
    });




// ##### HIGHCHARTS EXPEREMENT


  $scope.chartSeries = [];
  $scope.chartTimeSeries = [];

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
    loading: false,
    size: {}
  };


  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };


    //	Route: /api/es/kodemon/:project
  	$http.get(url).success(function (data){
        $scope.functionByFileContainer = data.aggregations.group_by_functions.buckets;
        setupFunctionList($scope.functionByFileContainer);
        $scope.chartConfig.loading = !$scope.chartConfig.loading;
        $scope.selectedFunction = $scope.functionByFileContainer[0];
        console.log($scope.functionByFileContainer[0].key);
      }).error(function(error){
        console.log(error);
      });

    function setupFunctionList(data){
      for (var i = data.length - 1; i >= 0; i--) {
        var derp = {'item': { 'function': data[i].key, 'data':[0], 'updateTime': sTime, 'name': data[i].key }, 'id': data[i].key };
        functionList.push(derp);
        $scope.chartSeries.push(derp.item);

      }
    }


    $scope.getFunctionValuesByTimerange = function(i){
        //  Route: /api/es/kodemon/:project/:function/timerange
        $http.post(url+'/timerange', {
          startTime: $scope.startDay,
          endTime: $scope.endDay,
          fu: i.key
        }).success( function  (data) {
          console.log('POST: /kodemon/key.py/timerange');
          console.log(data);
          var tmp = [];
          for(var item in data){
              tmp.push(data[item]._source.execution_time);
          }
          $scope.chartTimeSeries.push({'name': i.key ,'data':tmp, 'start': $scope.startDay});
          $scope.functionCallsFilteredByFunctionAndTimeContainer = data;
          console.log('RESP: /kodemon/key.py/timerange');
        });
    };

$scope.removeTimeSeries = function(i){
        var seriesArray = $scope.chartTimeSeries;
        seriesArray.splice(i.id, 1);
}

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
