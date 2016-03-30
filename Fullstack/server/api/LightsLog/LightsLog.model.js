'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LightsLogSchema = new mongoose.Schema({
    description: String,
    createdAt: String,
    updatedAt: String
});

export default mongoose.model('LightsLog', LightsLogSchema);
