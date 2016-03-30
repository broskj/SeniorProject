'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var LightsLogCtrlStub = {
  index: 'LightsLogCtrl.index',
  show: 'LightsLogCtrl.show',
  create: 'LightsLogCtrl.create',
  update: 'LightsLogCtrl.update',
  destroy: 'LightsLogCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var LightsLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './LightsLog.controller': LightsLogCtrlStub
});

describe('LightsLog API Router:', function() {

  it('should return an express router instance', function() {
    LightsLogIndex.should.equal(routerStub);
  });

  describe('GET /api/LightsLogs', function() {

    it('should route to LightsLog.controller.index', function() {
      routerStub.get
        .withArgs('/', 'LightsLogCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/LightsLogs/:id', function() {

    it('should route to LightsLog.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'LightsLogCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/LightsLogs', function() {

    it('should route to LightsLog.controller.create', function() {
      routerStub.post
        .withArgs('/', 'LightsLogCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/LightsLogs/:id', function() {

    it('should route to LightsLog.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'LightsLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/LightsLogs/:id', function() {

    it('should route to LightsLog.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'LightsLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/LightsLogs/:id', function() {

    it('should route to LightsLog.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'LightsLogCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
