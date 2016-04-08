'use strict';

angular.module('fullstackApp')
  .controller('OverviewCtrl', function ($scope, $location) {
    $scope.headers = [
        'Alarm',
        'Lights',
        'Weather'
    ];
    $scope.message = 'View and control all components in this compact view.';
  });
