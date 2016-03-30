'use strict';

angular.module('fullstackApp')
  .controller('LightsCtrl', function ($scope, $location, LightsService) {
    $scope.lights = [];
    $scope.log = [];
    $scope.headers = [
        'Controller',
        'Log'
    ];
    $scope.message = 'This is the Lights controller.  Each light may be powered on/off, turned on when motion is detected, and set to turn on and off at specified times.';

    // populate log initially
    LightsService.getLog().then(function(res) {
        console.log(res);
        $scope.log = res.data;
        //LightsService.reinitLog($scope.log);
    });

    $scope.updateLog = function() {
        LightsService.getLog().then(function(res) {
            console.log(res);
            $scope.log = res.data;

            if($scope.log.length > 30) {
                LightsService.deleteLog($scope.log[0]);
            }
        });
    }

    // populate lights initially
    LightsService.getLights().then(function(res) {
        console.log(res);
        $scope.lights = res.data;
        //LightsService.reinitLights($scope.lights);
        /*
        // initialize lights if not created
        if($scope.lights.length === 0) {
            LightsService.initLights();
            LightsService.getLights().then(function(res) {
                $scope.lights = res.data;
            });
        }
        */
    });

    $scope.toggleStatus = function(light) {
        LightsService.toggleStatus(light).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }

    $scope.toggleMotion = function(light) {
        LightsService.toggleMotion(light).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }

    $scope.toggleTimed = function(light) {
        LightsService.toggleTimed(light).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }

    $scope.updateTime = function(light, on, off) {
        if(!on) {
            on = light.onTime;
        }
        if(!off) {
            off = light.offTime;
        }
        on = moment(on).format("HH:mm:ss");
        off = moment(off).format("HH:mm:ss");
        LightsService.updateTime(light, on, off).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }

  });
