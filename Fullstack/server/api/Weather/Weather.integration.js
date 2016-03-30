'use strict';

var app = require('../..');
import request from 'supertest';

var newWeather;

describe('Weather API:', function() {

  describe('GET /api/Weather', function() {
    var Weathers;

    beforeEach(function(done) {
      request(app)
        .get('/api/Weather')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Weathers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Weathers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/Weather', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Weather')
        .send({
          name: 'New Weather',
          info: 'This is the brand new Weather!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWeather = res.body;
          done();
        });
    });

    it('should respond with the newly created Weather', function() {
      newWeather.name.should.equal('New Weather');
      newWeather.info.should.equal('This is the brand new Weather!!!');
    });

  });

  describe('GET /api/Weather/:id', function() {
    var Weather;

    beforeEach(function(done) {
      request(app)
        .get('/api/Weather/' + newWeather._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Weather = res.body;
          done();
        });
    });

    afterEach(function() {
      Weather = {};
    });

    it('should respond with the requested Weather', function() {
      Weather.name.should.equal('New Weather');
      Weather.info.should.equal('This is the brand new Weather!!!');
    });

  });

  describe('PUT /api/Weather/:id', function() {
    var updatedWeather;

    beforeEach(function(done) {
      request(app)
        .put('/api/Weather/' + newWeather._id)
        .send({
          name: 'Updated Weather',
          info: 'This is the updated Weather!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWeather = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWeather = {};
    });

    it('should respond with the updated Weather', function() {
      updatedWeather.name.should.equal('Updated Weather');
      updatedWeather.info.should.equal('This is the updated Weather!!!');
    });

  });

  describe('DELETE /api/Weather/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/Weather/' + newWeather._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Weather does not exist', function(done) {
      request(app)
        .delete('/api/Weather/' + newWeather._id)
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
