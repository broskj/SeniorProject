'use strict';

describe('Controller: JaxComedyCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var JaxComedyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JaxComedyCtrl = $controller('JaxComedyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
