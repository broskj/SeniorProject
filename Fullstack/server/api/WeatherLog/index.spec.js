'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var WeatherLogCtrlStub = {
  index: 'WeatherLogCtrl.index',
  show: 'WeatherLogCtrl.show',
  create: 'WeatherLogCtrl.create',
  update: 'WeatherLogCtrl.update',
  destroy: 'WeatherLogCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var WeatherLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './WeatherLog.controller': WeatherLogCtrlStub
});

describe('WeatherLog API Router:', function() {

  it('should return an express router instance', function() {
    WeatherLogIndex.should.equal(routerStub);
  });

  describe('GET /api/WeatherLogs', function() {

    it('should route to WeatherLog.controller.index', function() {
      routerStub.get
        .withArgs('/', 'WeatherLogCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/WeatherLogs/:id', function() {

    it('should route to WeatherLog.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'WeatherLogCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/WeatherLogs', function() {

    it('should route to WeatherLog.controller.create', function() {
      routerStub.post
        .withArgs('/', 'WeatherLogCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/WeatherLogs/:id', function() {

    it('should route to WeatherLog.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'WeatherLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/WeatherLogs/:id', function() {

    it('should route to WeatherLog.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'WeatherLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/WeatherLogs/:id', function() {

    it('should route to WeatherLog.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'WeatherLogCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
