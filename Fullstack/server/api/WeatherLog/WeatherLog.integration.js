'use strict';

var app = require('../..');
import request from 'supertest';

var newWeatherLog;

describe('WeatherLog API:', function() {

  describe('GET /api/WeatherLogs', function() {
    var WeatherLogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/WeatherLogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          WeatherLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      WeatherLogs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/WeatherLogs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/WeatherLogs')
        .send({
          name: 'New WeatherLog',
          info: 'This is the brand new WeatherLog!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWeatherLog = res.body;
          done();
        });
    });

    it('should respond with the newly created WeatherLog', function() {
      newWeatherLog.name.should.equal('New WeatherLog');
      newWeatherLog.info.should.equal('This is the brand new WeatherLog!!!');
    });

  });

  describe('GET /api/WeatherLogs/:id', function() {
    var WeatherLog;

    beforeEach(function(done) {
      request(app)
        .get('/api/WeatherLogs/' + newWeatherLog._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          WeatherLog = res.body;
          done();
        });
    });

    afterEach(function() {
      WeatherLog = {};
    });

    it('should respond with the requested WeatherLog', function() {
      WeatherLog.name.should.equal('New WeatherLog');
      WeatherLog.info.should.equal('This is the brand new WeatherLog!!!');
    });

  });

  describe('PUT /api/WeatherLogs/:id', function() {
    var updatedWeatherLog;

    beforeEach(function(done) {
      request(app)
        .put('/api/WeatherLogs/' + newWeatherLog._id)
        .send({
          name: 'Updated WeatherLog',
          info: 'This is the updated WeatherLog!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWeatherLog = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWeatherLog = {};
    });

    it('should respond with the updated WeatherLog', function() {
      updatedWeatherLog.name.should.equal('Updated WeatherLog');
      updatedWeatherLog.info.should.equal('This is the updated WeatherLog!!!');
    });

  });

  describe('DELETE /api/WeatherLogs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/WeatherLogs/' + newWeatherLog._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when WeatherLog does not exist', function(done) {
      request(app)
        .delete('/api/WeatherLogs/' + newWeatherLog._id)
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
