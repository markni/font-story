/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Record = require('./record.model');

exports.register = function(socket) {
  Record.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Record.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('record:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('record:remove', doc);
}