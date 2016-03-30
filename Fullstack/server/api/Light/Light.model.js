'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LightSchema = new mongoose.Schema({
    status: Boolean,
    timed: Boolean,
    onTime: String,
    offTime: String,
    onMotion: Boolean,
    description: String,
    createdAt: String,
    updatedAt: String
});

export default mongoose.model('Light', LightSchema);
