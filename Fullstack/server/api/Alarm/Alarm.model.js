'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var AlarmSchema = new mongoose.Schema({
    status: Boolean,
    createdAt: String,
    updatedAt: String
});

export default mongoose.model('Alarm', AlarmSchema);
