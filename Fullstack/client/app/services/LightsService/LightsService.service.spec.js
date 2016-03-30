'use strict';

describe('Service: LightsService', function () {

  // load the service's module
  beforeEach(module('fullstackApp'));

  // instantiate service
  var LightsService;
  beforeEach(inject(function (_LightsService_) {
    LightsService = _LightsService_;
  }));

  it('should do something', function () {
    expect(!!LightsService).toBe(true);
  });

});
