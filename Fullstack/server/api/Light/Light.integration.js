'use strict';

var app = require('../..');
import request from 'supertest';

var newLight;

describe('Light API:', function() {

  describe('GET /api/Lights', function() {
    var Lights;

    beforeEach(function(done) {
      request(app)
        .get('/api/Lights')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Lights = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Lights.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/Lights', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Lights')
        .send({
          name: 'New Light',
          info: 'This is the brand new Light!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLight = res.body;
          done();
        });
    });

    it('should respond with the newly created Light', function() {
      newLight.name.should.equal('New Light');
      newLight.info.should.equal('This is the brand new Light!!!');
    });

  });

  describe('GET /api/Lights/:id', function() {
    var Light;

    beforeEach(function(done) {
      request(app)
        .get('/api/Lights/' + newLight._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Light = res.body;
          done();
        });
    });

    afterEach(function() {
      Light = {};
    });

    it('should respond with the requested Light', function() {
      Light.name.should.equal('New Light');
      Light.info.should.equal('This is the brand new Light!!!');
    });

  });

  describe('PUT /api/Lights/:id', function() {
    var updatedLight;

    beforeEach(function(done) {
      request(app)
        .put('/api/Lights/' + newLight._id)
        .send({
          name: 'Updated Light',
          info: 'This is the updated Light!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLight = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLight = {};
    });

    it('should respond with the updated Light', function() {
      updatedLight.name.should.equal('Updated Light');
      updatedLight.info.should.equal('This is the updated Light!!!');
    });

  });

  describe('DELETE /api/Lights/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/Lights/' + newLight._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Light does not exist', function(done) {
      request(app)
        .delete('/api/Lights/' + newLight._id)
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
