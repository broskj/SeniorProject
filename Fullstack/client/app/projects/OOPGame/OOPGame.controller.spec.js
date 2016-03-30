'use strict';

describe('Controller: OOPGameCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var OOPGameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OOPGameCtrl = $controller('OOPGameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
