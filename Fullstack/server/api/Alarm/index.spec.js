'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var AlarmCtrlStub = {
  index: 'AlarmCtrl.index',
  show: 'AlarmCtrl.show',
  create: 'AlarmCtrl.create',
  update: 'AlarmCtrl.update',
  destroy: 'AlarmCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var AlarmIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Alarm.controller': AlarmCtrlStub
});

describe('Alarm API Router:', function() {

  it('should return an express router instance', function() {
    AlarmIndex.should.equal(routerStub);
  });

  describe('GET /api/Alarms', function() {

    it('should route to Alarm.controller.index', function() {
      routerStub.get
        .withArgs('/', 'AlarmCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/Alarms/:id', function() {

    it('should route to Alarm.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'AlarmCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/Alarms', function() {

    it('should route to Alarm.controller.create', function() {
      routerStub.post
        .withArgs('/', 'AlarmCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/Alarms/:id', function() {

    it('should route to Alarm.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'AlarmCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/Alarms/:id', function() {

    it('should route to Alarm.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'AlarmCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/Alarms/:id', function() {

    it('should route to Alarm.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'AlarmCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
