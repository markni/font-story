'use strict';

var express = require('express');
var controller = require('./record.controller');

var router = express.Router();

router.get('/fallbacks/:name', controller.getFallbacksByName);
router.get('/top', controller.getMostPopular);

router.get('/', controller.index);
router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;