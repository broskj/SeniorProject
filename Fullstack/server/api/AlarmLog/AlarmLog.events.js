/**
 * AlarmLog model events
 */

'use strict';

import {EventEmitter} from 'events';
var AlarmLog = require('./AlarmLog.model');
var AlarmLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AlarmLogEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  AlarmLog.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AlarmLogEvents.emit(event + ':' + doc._id, doc);
    AlarmLogEvents.emit(event, doc);
  }
}

export default AlarmLogEvents;
