'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var WeatherSchema = new mongoose.Schema({
    duration: Number,
    fetch: Boolean,
    createdAt: String,
    updatedAt: String
});

export default mongoose.model('Weather', WeatherSchema);
