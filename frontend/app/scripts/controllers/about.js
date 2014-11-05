'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AboutCtrl', function ($scope) {

    $scope.getIndexes = function(){
      $http.get('http://localhost:5002/api/reindex/:kodemon').success(f)

    }
  });
