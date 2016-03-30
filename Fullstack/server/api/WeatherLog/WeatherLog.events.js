/**
 * WeatherLog model events
 */

'use strict';

import {EventEmitter} from 'events';
var WeatherLog = require('./WeatherLog.model');
var WeatherLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WeatherLogEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  WeatherLog.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    WeatherLogEvents.emit(event + ':' + doc._id, doc);
    WeatherLogEvents.emit(event, doc);
  }
}

export default WeatherLogEvents;
