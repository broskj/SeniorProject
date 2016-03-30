'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/WatchYoWrist', {
        templateUrl: 'app/projects/WatchYoWrist/WatchYoWrist.html',
        controller: 'WatchYoWristCtrl'
      });
  });
