'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'highcharts-ng'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/:file', {
        templateUrl: 'views/file.html',
        controller: 'FileCtrl'
      })
      .when('/:file/:function', {
        templateUrl: 'views/function.html',
        controller: 'FuncCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/hs', {
        templateUrl: 'views/hs.html',
        controller: 'HsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
