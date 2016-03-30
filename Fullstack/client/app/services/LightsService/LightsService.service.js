'use strict';

angular.module('fullstackApp')
  .service('LightsService', function ($http) {
      var baseUrl = "api/Lights";
      var baseLogUrl = "api/LightsLogs";

      var initTime = function() {
          return {
              createdAt: moment().format('MMMM Do YYYY h:mm:ss'),
              updatedAt: moment().format('MMMM Do YYYY h:mm:ss')
          }
      };

      var methods = {
          getLights: function() {
              return $http.get(baseUrl);
          },
          getLog: function() {
              return $http.get(baseLogUrl);
          },
          deleteLog: function(log) {
              return $http.delete(baseLogUrl + '/' + log._id);
          },
          initLights: function() {
              methods.createLight(true, false, "", "", true, "Light 1");
              methods.createLight(true, false, "", "", true, "Light 2");
              methods.createLight(true, true, "18:00", "06:00", true, "Light 3");
              methods.createLight(true, true, "05:45", "07:15", true, "Light 4");
          },
          reinitLights: function(lights) {
              for(var i = 0; i < lights.length; i++) {
                  $http.delete(baseUrl + '/' + lights[i]._id);
              }
              methods.initLights();
          },
          reinitLog: function(log) {
              for(var i = 0; i < log.length; i++) {
                  $http.delete(baseLogUrl + '/' + log[i]._id)
              }
          },
          createLight: function(newStatus, newTimed, newOnTime, newOffTime, newOnMotion, newDescription) {
              var newLight = {
                  status: newStatus,
                  timed: newTimed,
                  onTime: newOnTime,
                  offTime: newOffTime,
                  onMotion: newOnMotion,
                  description: newDescription
              };
              var times = initTime();
              newLight.createdAt = times.createdAt;
              newLight.updatedAt = times.updatedAt;

              methods.appendLog(newLight.description + " created.");
              return $http.post(baseUrl, newLight);
          },
          toggleStatus: function(light) {
              var times = initTime();
              light.updatedAt = times.updatedAt;
              light.status = !light.status;

              if(light.status === true) {
                  methods.appendLog(light.description + " toggled on.");
              } else {
                  methods.appendLog(light.description + " toggled off.");
              }
              return $http.put(baseUrl + '/' + light._id, light);
          },
          toggleMotion: function(light) {
              var times = initTime();
              light.updatedAt = times.updatedAt;
              light.onMotion = !light.onMotion;

              if(light.onMotion === true) {
                  methods.appendLog(light.description + " is now detecting motion.");
              } else {
                  methods.appendLog(light.description + " is no longer detecting motion.");
              }
              return $http.put(baseUrl + '/' + light._id, light);
          },
          toggleTimed: function(light) {
              var times = initTime();
              light.updatedAt = times.updatedAt;
              light.timed = !light.timed;

              if(light.timed === true) {
                  methods.appendLog(light.description + " is now on a schedule.");
              } else {
                  methods.appendLog(light.description + " is no longer on a schedule.");
              }
              return $http.put(baseUrl + '/' + light._id, light);
          },
          updateTime: function(light, onTime, offTime) {
              var times = initTime();
              light.updatedAt = times.updatedAt;
              light.onTime = onTime;
              light.offTime = offTime;

              methods.appendLog(light.description + " is now set to turn on at " + light.onTime + " and off at " + light.offTime);
              $http.put(baseUrl + '/' + light._id, light);
              return $http.get(baseUrl);
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
