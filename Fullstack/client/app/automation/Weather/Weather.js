'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/automation/Weather', {
        templateUrl: 'app/automation/Weather/Weather.html',
        controller: 'WeatherCtrl'
      });
  });
