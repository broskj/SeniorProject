'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var AlarmLogCtrlStub = {
  index: 'AlarmLogCtrl.index',
  show: 'AlarmLogCtrl.show',
  create: 'AlarmLogCtrl.create',
  update: 'AlarmLogCtrl.update',
  destroy: 'AlarmLogCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var AlarmLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './AlarmLog.controller': AlarmLogCtrlStub
});

describe('AlarmLog API Router:', function() {

  it('should return an express router instance', function() {
    AlarmLogIndex.should.equal(routerStub);
  });

  describe('GET /api/AlarmLogs', function() {

    it('should route to AlarmLog.controller.index', function() {
      routerStub.get
        .withArgs('/', 'AlarmLogCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/AlarmLogs/:id', function() {

    it('should route to AlarmLog.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'AlarmLogCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/AlarmLogs', function() {

    it('should route to AlarmLog.controller.create', function() {
      routerStub.post
        .withArgs('/', 'AlarmLogCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/AlarmLogs/:id', function() {

    it('should route to AlarmLog.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'AlarmLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/AlarmLogs/:id', function() {

    it('should route to AlarmLog.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'AlarmLogCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/AlarmLogs/:id', function() {

    it('should route to AlarmLog.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'AlarmLogCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
