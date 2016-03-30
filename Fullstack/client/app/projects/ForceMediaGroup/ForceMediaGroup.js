'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/ForceMediaGroup', {
        templateUrl: 'app/projects/ForceMediaGroup/ForceMediaGroup.html',
        controller: 'ForceMediaGroupCtrl'
      });
  });
