'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/automation/Alarm', {
        templateUrl: 'app/automation//Alarm/Alarm.html',
        controller: 'AlarmCtrl'
      });
  });
