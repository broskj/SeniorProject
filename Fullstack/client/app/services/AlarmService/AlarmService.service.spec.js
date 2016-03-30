'use strict';

describe('Service: AlarmService', function () {

  // load the service's module
  beforeEach(module('fullstackApp'));

  // instantiate service
  var AlarmService;
  beforeEach(inject(function (_AlarmService_) {
    AlarmService = _AlarmService_;
  }));

  it('should do something', function () {
    expect(!!AlarmService).toBe(true);
  });

});
