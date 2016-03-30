'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var WeatherCtrlStub = {
  index: 'WeatherCtrl.index',
  show: 'WeatherCtrl.show',
  create: 'WeatherCtrl.create',
  update: 'WeatherCtrl.update',
  destroy: 'WeatherCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var WeatherIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Weather.controller': WeatherCtrlStub
});

describe('Weather API Router:', function() {

  it('should return an express router instance', function() {
    WeatherIndex.should.equal(routerStub);
  });

  describe('GET /api/Weather', function() {

    it('should route to Weather.controller.index', function() {
      routerStub.get
        .withArgs('/', 'WeatherCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/Weather/:id', function() {

    it('should route to Weather.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'WeatherCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/Weather', function() {

    it('should route to Weather.controller.create', function() {
      routerStub.post
        .withArgs('/', 'WeatherCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/Weather/:id', function() {

    it('should route to Weather.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'WeatherCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/Weather/:id', function() {

    it('should route to Weather.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'WeatherCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/Weather/:id', function() {

    it('should route to Weather.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'WeatherCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
