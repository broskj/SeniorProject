/**
 * Light model events
 */

'use strict';

import {EventEmitter} from 'events';
var Light = require('./Light.model');
var LightEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LightEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Light.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    LightEvents.emit(event + ':' + doc._id, doc);
    LightEvents.emit(event, doc);
  }
}

export default LightEvents;
