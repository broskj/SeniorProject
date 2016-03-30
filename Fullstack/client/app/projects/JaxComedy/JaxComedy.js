'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/JaxComedy', {
        templateUrl: 'app/projects/JaxComedy/JaxComedy.html',
        controller: 'JaxComedyCtrl'
      });
  });
