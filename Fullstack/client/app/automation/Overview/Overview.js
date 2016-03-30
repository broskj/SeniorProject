'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/automation/Overview', {
        templateUrl: 'app/automation/Overview/Overview.html',
        controller: 'OverviewCtrl'
      });
  });
