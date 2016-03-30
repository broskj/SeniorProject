'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var WeatherLogSchema = new mongoose.Schema({
    temp: Number,
    hum: Number,
    description: String,
    createdAt: String,
    updatedAt: String
});

export default mongoose.model('WeatherLog', WeatherLogSchema);
