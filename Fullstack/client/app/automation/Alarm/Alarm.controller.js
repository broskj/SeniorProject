'use strict';

angular.module('fullstackApp')
  .controller('AlarmCtrl', function ($scope, $location, AlarmService) {
    $scope.alarms = [];
    $scope.log = [];
    $scope.headers = [
        'Controller',
        'Log'
    ];
    $scope.message = 'This is the alarm controller.  Here you can toggle the state of the alarm and view a log of events.';

    AlarmService.getLog().then(function(res) {
        console.log(res);
        $scope.log = res.data;
    });

    $scope.updateLog = function() {
        AlarmService.getLog().then(function(res) {
            console.log(res);
            $scope.log = res.data;

            if($scope.log.length > 30) {
                AlarmService.deleteLog($scope.log[0]);
            }
        });
    }

    AlarmService.getAlarm().then(function(res) {
        console.log(res);
        $scope.alarms = res.data;

        if($scope.alarms.length === 0) {
            AlarmService.initAlarm().then(function(res) {
                AlarmService.getAlarm().then(function(res) {
                    $scope.alarms = res.data;
                });
            });
        }
    });

    $scope.toggleAlarm = function(alarm) {
        AlarmService.toggleAlarm(alarm).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }

  });
