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

}]).
controller('LightsCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('WeatherCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]).
controller('AlarmCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {

}]);