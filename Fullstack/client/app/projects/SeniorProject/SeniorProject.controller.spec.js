'use strict';

describe('Controller: SeniorProjectCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var SeniorProjectCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeniorProjectCtrl = $controller('SeniorProjectCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
