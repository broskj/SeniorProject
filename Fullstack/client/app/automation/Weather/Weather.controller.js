'use strict';

angular.module('fullstackApp')
  .controller('WeatherCtrl', function ($scope, $location, WeatherService) {
    $scope.weather = [];
    $scope.log = [];
    $scope.headers = [
        'Controller',
        'Log'
    ]
    $scope.message = 'This is the weather controller.  Here you can set the duration between automatic fetches and request immediate weather data.  You can also view a log of past weather data.';
    $scope.submit = false;

    WeatherService.getLog().then(function(res) {
        console.log(res);
        $scope.log = res.data;
    });

    $scope.updateLog = function() {
        WeatherService.getLog().then(function(res) {
            console.log(res);
            $scope.log = res.data;

            if($scope.log.length > 30) {
                WeatherService.deleteLog($scope.log[0]);
            }
        });
    }

    WeatherService.getWeather().then(function(res) {
        console.log(res);
        $scope.weather = res.data;

        if($scope.weather.length === 0) {
            WeatherService.initWeather().then(function(res) {
                WeatherService.getWeather().then(function(res) {
                    $scope.weather = res.data;
                })
            })
        }
    });

    $scope.updateDuration = function(weather, newDuration) {
        if(!newDuration) {
            newDuration = weather.duration;
        }
        WeatherService.updateDuration(weather, newDuration).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }

    $scope.fetchNow = function(weather) {
        WeatherService.fetchNow(weather).then(function(res) {
            console.log(res);
            $scope.updateLog();
        });
    }
  });
