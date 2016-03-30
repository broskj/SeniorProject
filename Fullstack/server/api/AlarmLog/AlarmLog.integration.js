'use strict';

var app = require('../..');
import request from 'supertest';

var newAlarmLog;

describe('AlarmLog API:', function() {

  describe('GET /api/AlarmLogs', function() {
    var AlarmLogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/AlarmLogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          AlarmLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      AlarmLogs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/AlarmLogs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/AlarmLogs')
        .send({
          name: 'New AlarmLog',
          info: 'This is the brand new AlarmLog!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAlarmLog = res.body;
          done();
        });
    });

    it('should respond with the newly created AlarmLog', function() {
      newAlarmLog.name.should.equal('New AlarmLog');
      newAlarmLog.info.should.equal('This is the brand new AlarmLog!!!');
    });

  });

  describe('GET /api/AlarmLogs/:id', function() {
    var AlarmLog;

    beforeEach(function(done) {
      request(app)
        .get('/api/AlarmLogs/' + newAlarmLog._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          AlarmLog = res.body;
          done();
        });
    });

    afterEach(function() {
      AlarmLog = {};
    });

    it('should respond with the requested AlarmLog', function() {
      AlarmLog.name.should.equal('New AlarmLog');
      AlarmLog.info.should.equal('This is the brand new AlarmLog!!!');
    });

  });

  describe('PUT /api/AlarmLogs/:id', function() {
    var updatedAlarmLog;

    beforeEach(function(done) {
      request(app)
        .put('/api/AlarmLogs/' + newAlarmLog._id)
        .send({
          name: 'Updated AlarmLog',
          info: 'This is the updated AlarmLog!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAlarmLog = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAlarmLog = {};
    });

    it('should respond with the updated AlarmLog', function() {
      updatedAlarmLog.name.should.equal('Updated AlarmLog');
      updatedAlarmLog.info.should.equal('This is the updated AlarmLog!!!');
    });

  });

  describe('DELETE /api/AlarmLogs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/AlarmLogs/' + newAlarmLog._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when AlarmLog does not exist', function(done) {
      request(app)
        .delete('/api/AlarmLogs/' + newAlarmLog._id)
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
