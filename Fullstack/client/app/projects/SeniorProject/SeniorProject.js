'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/SeniorProject', {
        templateUrl: 'app/projects/SeniorProject/SeniorProject.html',
        controller: 'SeniorProjectCtrl'
      });
  });
