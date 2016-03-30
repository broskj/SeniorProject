/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Weather              ->  index
 * POST    /api/Weather              ->  create
 * GET     /api/Weather/:id          ->  show
 * PUT     /api/Weather/:id          ->  update
 * DELETE  /api/Weather/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Weather from './Weather.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Weathers
export function index(req, res) {
  Weather.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Weather from the DB
export function show(req, res) {
  Weather.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Weather in the DB
export function create(req, res) {
  Weather.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Weather in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Weather.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Weather from the DB
export function destroy(req, res) {
  Weather.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
