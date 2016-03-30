/**
 * LightsLog model events
 */

'use strict';

import {EventEmitter} from 'events';
var LightsLog = require('./LightsLog.model');
var LightsLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LightsLogEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  LightsLog.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    LightsLogEvents.emit(event + ':' + doc._id, doc);
    LightsLogEvents.emit(event, doc);
  }
}

export default LightsLogEvents;
