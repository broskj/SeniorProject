'use strict';

angular.module('fullstackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/projects/BattleShip', {
        templateUrl: 'app/projects/BattleShip/BattleShip.html',
        controller: 'BattleShipCtrl'
      });
  });
