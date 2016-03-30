'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var LightCtrlStub = {
  index: 'LightCtrl.index',
  show: 'LightCtrl.show',
  create: 'LightCtrl.create',
  update: 'LightCtrl.update',
  destroy: 'LightCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var LightIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Light.controller': LightCtrlStub
});

describe('Light API Router:', function() {

  it('should return an express router instance', function() {
    LightIndex.should.equal(routerStub);
  });

  describe('GET /api/Lights', function() {

    it('should route to Light.controller.index', function() {
      routerStub.get
        .withArgs('/', 'LightCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/Lights/:id', function() {

    it('should route to Light.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'LightCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/Lights', function() {

    it('should route to Light.controller.create', function() {
      routerStub.post
        .withArgs('/', 'LightCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/Lights/:id', function() {

    it('should route to Light.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'LightCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/Lights/:id', function() {

    it('should route to Light.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'LightCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/Lights/:id', function() {

    it('should route to Light.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'LightCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
