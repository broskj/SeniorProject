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
            templateUrl: 'templates/projects/SeniorProject.html',
            controller: 'SeniorProjectCtrl'
        })
        .when('/projects/TheForceMediaGroup', {
            templateUrl: 'templates/projects/TheForceMediaGroup.html',
            controller: 'TheForceMediaGroupCtrl'
        })
        .when('/projects/WatchYoWrist', {
            templateUrl: 'templates/projects/WatchYoWrist.html',
            controller: 'WatchYoWristCtrl'
        })
        .when('/projects/JaxComedy', {
            templateUrl: 'templates/projects/JaxComedy.html',
            controller: 'JaxComedyCtrl'
        })
        .when('/projects/BattleShip', {
            templateUrl: 'templates/projects/BattleShip.html',
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
    $scope.loggedIn = false;

    $scope.test = function() {
        $http({
            method: 'POST',
            url: '/auth/login',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:1337/auth/google_oauth2'
            }
        }).success(function(response){
            $scope.loggedIn = true;
            console.log(response);
        });
    }
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
    // nothing
}]).
controller('LightsCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {
    $scope.lights = {};
    $scope.lightsLog = {};
    $scope.events = {};

    $http({
        method: 'GET',
        url: '/LightsCtrl'/*,
        headers: {
            'Authorization': 'Bearer ' + 123
        }*/
    }).success(function (response) {
        $scope.lights = response;
    });
    $http({
        method: 'GET',
        url: '/LightsLog'
    }).success(function (response) {
        $scope.lightsLog = response;
    });

    $scope.toggleState = function(light) {
        $http({
            method: 'PUT',
            url: '/LightsCtrl/update/' + light.id,
            params: {
                status: !light.status
            }
        }).then(function successCallback(response) {
            $scope.lights[light.id-1] = response.data;

            if($scope.lightsLog.length > 28) {
                $http({
                    method: 'DELETE',
                    url: '/LightsLog/destroy/' + $scope.lightsLog[0].id
                }).success(function (response){
                    console.log("delete successful")
                });
            }

            var logDescription = "Light " + light.id + " was turned ";

            if(response.data.status) {
                logDescription += "on.";
            } else {
                logDescription += "off.";
            }

            $http({
                method: 'POST',
                url: '/LightsLog/create',
                params: {
                    description: logDescription
                }
            }).success(function (response) {
                $http({
                    method: 'GET',
                    url: '/LightsLog'
                }).success(function (response) {
                    $scope.lightsLog = response;
                });
            });
        });
    } // end toggleState

    $scope.toggleMotion = function(light) {
        $http({
            method: 'PUT',
            url: 'LightsCtrl/update/' + light.id,
            params: {
                onMotion: !light.onMotion
            }
        }).then(function successCallback(response) {
            //console.log("success called")
            //console.log(response);
            $scope.lights[light.id-1] = response.data;

            if($scope.lightsLog.length > 28) {
                $http({
                    method: 'DELETE',
                    url: '/LightsLog/destroy/' + $scope.lightsLog[0].id
                }).success(function (response){
                    console.log("delete successful")
                });
            }

            var logDescription = "Light " + light.id + " is ";

            if(response.data.onMotion) {
                logDescription += "now detecting motion.";
            } else {
                logDescription += "no longer detecting motion.";
            }

            $http({
                method: 'POST',
                url: '/LightsLog/create',
                params: {
                    description: logDescription
                }
            }).success(function (response) {
                $http({
                    method: 'GET',
                    url: '/LightsLog'
                }).success(function (response) {
                    $scope.lightsLog = response;
                });
            });
        });
    } // end toggleMotion

    $scope.toggleTimed = function(light) {
        //console.log(light);
        //console.log(!light.onMotion);

        $http({
            method: 'PUT',
            url: 'LightsCtrl/update/' + light.id,
            params: {
                timed: !light.timed
            }
        }).then(function successCallback(response) {
            //console.log("success called")
            //console.log(response);
            $scope.lights[light.id-1] = response.data;

            if($scope.lightsLog.length > 28) {
                $http({
                    method: 'DELETE',
                    url: '/LightsLog/destroy/' + $scope.lightsLog[0].id
                }).success(function (response){
                    console.log("delete successful")
                });
            }

            var logDescription = "Light " + light.id + " is ";

            if(response.data.timed) {
                logDescription += "now on a timer.";
            } else {
                logDescription += "no longer on a timer.";
            }

            $http({
                method: 'POST',
                url: '/LightsLog/create',
                params: {
                    description: logDescription
                }
            }).success(function (response) {
                $http({
                    method: 'GET',
                    url: '/LightsLog'
                }).success(function (response) {
                    $scope.lightsLog = response;
                });
            });
        });
    } // ent toggleTimed

    $scope.updateTime = function(curLight, id) {
        console.log(curLight);

        $http({
            method: 'PUT',
            url: 'LightsCtrl/update/' + id,
            params: {
                onTime: curLight.onTime,
                offTime: curLight.offTime
            }
        }).then(function successCallback(response) {
            console.log(response);
            $scope.lights[id-1] = response.data;
        });
    } // end updateTime

    $scope.toggleAll = function() {
        console.log("this function doesn't work");
    } // end toggleAll
}]).
controller('WeatherCtrl', ['$scope', '$log', '$http', '$cookies', '$window', function ($scope, $log, $http, $cookies, $window) {
    $scope.weather = {};
    $scope.events = {};

    $http({
        method: 'GET',
        url: 'WeatherCtrl'
    }).success(function (response) {
        //console.log(response);
        $scope.weather = response;
    });

    $scope.updateDuration = function (input) {
        $http({
            method: 'PUT',
            url: 'WeatherCtrl/update/1',
            params: {
                duration: input
            }
        }).then(function successCallback(response) {
            console.log(response);
            $scope.weather[0] = response.data;
        });
    } // end updateDuration

    $scope.fetchNow = function() {
        $http({
            method: 'PUT',
            url: 'WeatherCtrl/update/1',
            params: {
                fetch: !$scope.weather[0].fetch
            }
        }).then(function successCallback(response) {
            console.log(response);
            $scope.weather[0] = response.data;
        });
    } // end fetchNow

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
        //console.log(curAlarm);
        $scope.newStatus = !curAlarm.status;
        //console.log($scope.newStatus);
        $http({
            method: 'PUT',
            url: '/AlarmCtrl/update/1',
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

            if($scope.alarmLog.length > 28) {
                $http({
                    method: 'DELETE',
                    url: '/AlarmLog/destroy/' + $scope.alarmLog[0].id
                }).success(function (response){
                    console.log("delete successful")
                });
            }

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
