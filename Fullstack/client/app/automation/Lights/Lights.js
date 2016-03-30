'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/automation/Lights', {
        templateUrl: 'app/automation/Lights/Lights.html',
        controller: 'LightsCtrl'
      });
  });
