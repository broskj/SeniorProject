'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/OOPGame', {
        templateUrl: 'app/projects/OOPGame/OOPGame.html',
        controller: 'OOPGameCtrl'
      });
  });
