'use strict';

angular.module('broskj-app', [
  'ngRoute', 'ngCookies', 'angular-toArrayFilter'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        })
        .when('/projects/SeniorProject', {
            templateUrl: 'templates/Projects/SeniorProject.html',
            controller: 'SeniorProjectCtrl'
        })
        .when('/projects/TheForceMediaGroup', {
            templateUrl: 'templates/Projects/TheForceMediaGroup.html',
            controller: 'TheForceMediaGroupCtrl'
        })
        .when('/projects/WatchYoWrist', {
            templateUrl: 'templates/Projects/WatchYoWrist.html',
            controller: 'WatchYoWristCtrl'
        })
        .when('/projects/JaxComedy', {
            templateUrl: 'templates/Projects/JaxComedy.html',
            controller: 'JaxComedyCtrl'
        })
        .when('/projects/BattleShip', {
            templateUrl: 'templates/Projects/BattleShip.html',
            controller: 'BattleShipCtrl'
        })
        .when('/automation/overview', {
            templateUrl: 'templates/automation/overview.html',
            controller: 'OverviewCtrl'
        })
        .when('/automation/lights', {
            templateUrl: 'templates/automation/lights.html',
            controller: 'LightsCtrl'
        })
        .when('/automation/weather', {
            templateUrl: 'templates/automation/weather.html',
            controller: 'WeatherCtrl'
        })
        .when('/automation/alarm', {
            templateUrl: 'templates/automation/alarm.html',
            controller: 'AlarmCtrl'
        });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]).
controller('MainCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('HomeCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('SeniorProjectCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('TheForceMediaGroupCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('WatchYoWristCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('JaxComedyCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('BattleShipCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('OverviewCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {
    $scope.lights = [];
    $scope.weatherLog = [];
    $scope.alarms = [];
    $scope.i = 0;
    $scope.j = 0;
    $scope.k = 0;

    $scope.addLight = function (light) {
        $scope.lights.push(light + " (" + $scope.i + ")");
        $scope.i++;
    }
    $scope.addWeather = function (weather) {
        $scope.weatherLog.push(weather + " (" + $scope.j + ")");
        $scope.j++;
    }
    $scope.addAlarm = function (alarm) {
        $scope.alarms.push(alarm + " (" + $scope.k + ")");
        $scope.k++;
    }

    $scope.lights.push("Light 1");
    $scope.lights.push("Light 2");
    $scope.lights.push("Light 3");
    $scope.lights.push("Light 4");

    $scope.weatherLog.push("Weather item 1");
    $scope.weatherLog.push("Weather item 2");
    $scope.weatherLog.push("Weather item 3");

    $scope.alarms.push("Alarm");
}]).
controller('LightsCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {
    $scope.lights = {};
    $scope.events = [];

    $http({
        method: 'GET',
        url: '/LightsCtrl'
    }).success(function (response) {
        $scope.lights = response;
    });

}]).
controller('WeatherCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {
    $scope.wlog = [];
    $scope.events = [];
    $scope.i = 0;
    $scope.unit = "m";

    $scope.addEntry = function (entry) {
        $scope.wlog.push(entry + " (" + $scope.i + ")");
        $scope.i++;
    }

    $scope.changeUnit = function (u) {
        $scope.unit = u;
    }

    $scope.wlog.push("Weather item 1");
    $scope.wlog.push("Weather item 2");
    $scope.wlog.push("Weather item 3");

}]).
controller('AlarmCtrl', ['$scope', '$log', '$http', '$route', '$window', function ($scope, $log, $http, $route, $window) {
    $scope.alarm = {};
    $scope.alarmLog = {};

    $http({
        method: 'GET',
        url: '/AlarmCtrl'
    }).success(function (response) {
        $scope.alarm = response;
    });

    $http({
        method: 'GET',
        url: '/AlarmLog'
    }).success(function (response) {
        $scope.alarmLog = response;
    });

    $scope.toggleAlarm = function (curAlarm) {
        console.log(curAlarm);
        $scope.newStatus = !curAlarm.status;
        console.log($scope.newStatus);
        $http({
            method: 'PUT',
            url: '/AlarmCtrl/update/' + curAlarm.id,
            params: {
                status: $scope.newStatus
            }
        }).then(function successCallback(response) {
            $scope.alarm[0] = response.data;
            $scope.logDescription = "";

            if ($scope.alarm[0].status)
                $scope.logDescription = "System armed."
            else
                $scope.logDescription = "System disarmed."

            $http({
                method: 'POST',
                url: '/AlarmLog/create',
                params: {
                    description: $scope.logDescription
                }
            }).success(function (response) {
                $http({
                    method: 'GET',
                    url: '/AlarmLog'
                }).success(function (response) {
                    $scope.alarmLog = response;
                });
            });
        });
    }

}]);