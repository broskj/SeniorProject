'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var AlarmLogSchema = new mongoose.Schema({
    description: String,
    createdAt: String,
    updatedAt: String
});

export default mongoose.model('AlarmLog', AlarmLogSchema);
