'use strict';

angular.module('fullstackApp')
  .service('AlarmService', function ($http) {
      var baseUrl = "/api/Alarms";
      var baseLogUrl = "/api/AlarmLogs";

      var initTime = function() {
          return {
              createdAt: moment().format('MMMM Do YYYY h:mm:ss'),
              updatedAt: moment().format('MMMM Do YYYY h:mm:ss')
          }
      }

      var methods = {
        getAlarm: function() {
            return $http.get(baseUrl);
        },
        getLog: function() {
            return $http.get(baseLogUrl);
        },
        deleteLog: function(log) {
            return $http.delete(baseLogUrl + '/' + log._id);
        },
        initAlarm: function() {
            return methods.createAlarm(false);
        },
        createAlarm: function(newStatus) {
            var newAlarm = {
                status: newStatus
            };
            var times = initTime();
            newAlarm.createdAt = times.createdAt;
            newAlarm.updatedAt = times.updatedAt;
            return $http.post(baseUrl, newAlarm);
        },
        toggleAlarm: function(alarm) {
            var times = initTime();
            alarm.updatedAt = times.updatedAt;
            alarm.status = !alarm.status;
            if(alarm.status) {
                methods.appendLog("System armed.");
            } else {
                methods.appendLog("System disarmed.");
            }
            return $http.put(baseUrl + '/' + alarm._id, alarm);
        },
        appendLog: function(newDescription) {
            var times = initTime();
            var newLog = {
                'description': newDescription,
                'createdAt': times.createdAt,
                'updatedAt': times.updatedAt
            };
            return $http.post(baseLogUrl, newLog);
        }
      };

      return methods;
  });
