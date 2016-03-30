'use strict';

var app = require('../..');
import request from 'supertest';

var newAlarm;

describe('Alarm API:', function() {

  describe('GET /api/Alarms', function() {
    var Alarms;

    beforeEach(function(done) {
      request(app)
        .get('/api/Alarms')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Alarms = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Alarms.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/Alarms', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Alarms')
        .send({
          name: 'New Alarm',
          info: 'This is the brand new Alarm!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAlarm = res.body;
          done();
        });
    });

    it('should respond with the newly created Alarm', function() {
      newAlarm.name.should.equal('New Alarm');
      newAlarm.info.should.equal('This is the brand new Alarm!!!');
    });

  });

  describe('GET /api/Alarms/:id', function() {
    var Alarm;

    beforeEach(function(done) {
      request(app)
        .get('/api/Alarms/' + newAlarm._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Alarm = res.body;
          done();
        });
    });

    afterEach(function() {
      Alarm = {};
    });

    it('should respond with the requested Alarm', function() {
      Alarm.name.should.equal('New Alarm');
      Alarm.info.should.equal('This is the brand new Alarm!!!');
    });

  });

  describe('PUT /api/Alarms/:id', function() {
    var updatedAlarm;

    beforeEach(function(done) {
      request(app)
        .put('/api/Alarms/' + newAlarm._id)
        .send({
          name: 'Updated Alarm',
          info: 'This is the updated Alarm!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAlarm = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAlarm = {};
    });

    it('should respond with the updated Alarm', function() {
      updatedAlarm.name.should.equal('Updated Alarm');
      updatedAlarm.info.should.equal('This is the updated Alarm!!!');
    });

  });

  describe('DELETE /api/Alarms/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/Alarms/' + newAlarm._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Alarm does not exist', function(done) {
      request(app)
        .delete('/api/Alarms/' + newAlarm._id)
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
