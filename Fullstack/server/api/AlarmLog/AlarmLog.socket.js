/**
 * Broadcast updates to client when the model changes
 */

'use strict';

require('events').EventEmitter.prototype._maxListeners = 100;
var AlarmLogEvents = require('./AlarmLog.events');

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('AlarmLog:' + event, socket);

    AlarmLogEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    AlarmLogEvents.removeListener(event, listener);
  };
}
