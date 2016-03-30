/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/WeatherLogs', require('./api/WeatherLog'));
  app.use('/api/Weather', require('./api/Weather'));
  app.use('/api/LightsLogs', require('./api/LightsLog'));
  app.use('/api/Lights', require('./api/Light'));
  app.use('/api/AlarmLogs', require('./api/AlarmLog'));
  app.use('/api/Alarms', require('./api/Alarm'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
