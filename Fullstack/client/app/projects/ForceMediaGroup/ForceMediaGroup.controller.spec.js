'use strict';

describe('Controller: ForceMediaGroupCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var ForceMediaGroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForceMediaGroupCtrl = $controller('ForceMediaGroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
