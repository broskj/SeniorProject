'use strict';

var app = require('../..');
import request from 'supertest';

var newLightsLog;

describe('LightsLog API:', function() {

  describe('GET /api/LightsLogs', function() {
    var LightsLogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/LightsLogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          LightsLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      LightsLogs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/LightsLogs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/LightsLogs')
        .send({
          name: 'New LightsLog',
          info: 'This is the brand new LightsLog!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLightsLog = res.body;
          done();
        });
    });

    it('should respond with the newly created LightsLog', function() {
      newLightsLog.name.should.equal('New LightsLog');
      newLightsLog.info.should.equal('This is the brand new LightsLog!!!');
    });

  });

  describe('GET /api/LightsLogs/:id', function() {
    var LightsLog;

    beforeEach(function(done) {
      request(app)
        .get('/api/LightsLogs/' + newLightsLog._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          LightsLog = res.body;
          done();
        });
    });

    afterEach(function() {
      LightsLog = {};
    });

    it('should respond with the requested LightsLog', function() {
      LightsLog.name.should.equal('New LightsLog');
      LightsLog.info.should.equal('This is the brand new LightsLog!!!');
    });

  });

  describe('PUT /api/LightsLogs/:id', function() {
    var updatedLightsLog;

    beforeEach(function(done) {
      request(app)
        .put('/api/LightsLogs/' + newLightsLog._id)
        .send({
          name: 'Updated LightsLog',
          info: 'This is the updated LightsLog!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLightsLog = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLightsLog = {};
    });

    it('should respond with the updated LightsLog', function() {
      updatedLightsLog.name.should.equal('Updated LightsLog');
      updatedLightsLog.info.should.equal('This is the updated LightsLog!!!');
    });

  });

  describe('DELETE /api/LightsLogs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/LightsLogs/' + newLightsLog._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when LightsLog does not exist', function(done) {
      request(app)
        .delete('/api/LightsLogs/' + newLightsLog._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
