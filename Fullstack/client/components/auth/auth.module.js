'use strict';

angular.module('fullstackApp.auth', [
  'fullstackApp.constants',
  'fullstackApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
