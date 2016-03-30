/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Lights              ->  index
 * POST    /api/Lights              ->  create
 * GET     /api/Lights/:id          ->  show
 * PUT     /api/Lights/:id          ->  update
 * DELETE  /api/Lights/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Light from './Light.model';

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

// Gets a list of Lights
export function index(req, res) {
  Light.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Light from the DB
export function show(req, res) {
  Light.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Light in the DB
export function create(req, res) {
  Light.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Light in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Light.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Light from the DB
export function destroy(req, res) {
  Light.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
