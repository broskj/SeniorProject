'use strict';

angular.module('fullstackApp')
  .service('WeatherService', function ($http) {
      var baseUrl = "api/Weather/";
      var baseLogUrl = "api/WeatherLogs";

      var initTime = function() {
          return {
              createdAt: moment().format('MMMM Do YYYY h:mm:ss'),
              updatedAt: moment().format('MMMM Do YYYY h:mm:ss')
          }
      }

      var methods = {
          getWeather: function() {
              return $http.get(baseUrl);
          },
          getLog: function() {
              return $http.get(baseLogUrl);
          },
          deleteLog: function(log) {
              return $http.delete(baseLogUrl + '/' + log._id);
          },
          initWeather: function() {
              return methods.createWeather(30);
          },
          createWeather: function(newDuration) {
              var newWeather = {
                  duration: newDuration,
                  fetch: false
              };
              var times = initTime();
              newWeather.createdAt = times.createdAt;
              newWeather.updatedAt = times.updatedAt;
              return $http.post(baseUrl, newWeather);
          },
          updateDuration: function(weather, newDuration) {
              var times = initTime();
              weather.updatedAt = times.updatedAt;
              weather.duration = newDuration;
              methods.appendLog("New fetch duration set to " + weather.duration + " minutes.");
              return $http.put(baseUrl + '/' + weather._id, weather);
          },
          fetchNow: function(weather) {
              var times = initTime();
              weather.updatedAt = times.updatedAt;
              /*
                weather.fetch = true;

                This is what needs to be called, not weather.fetch = !weather.fetch
                    the python needs to make a request to set the fetch variable back
                     to false
              */
              weather.fetch = !weather.fetch;
              methods.appendLog("Requesting current weather data...");
              return $http.put(baseUrl + '/' + weather._id, weather);
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
