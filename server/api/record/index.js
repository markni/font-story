'use strict';

var express = require('express');
var controller = require('./record.controller');

var apicache = require('apicache').options({ debug: false }).middleware;

var router = express.Router();

router.get('/fallbacks/:name',apicache('1 day'), controller.getFallbacksByName);
router.get('/top',apicache('45 minutes'), controller.getMostPopular);
router.get('/top/:range', apicache('45 minutes'),controller.getMostPopular);
router.get('/count', apicache('45 minutes'),controller.getCount);
router.get('/serif-vs-sans-serif', apicache('45 minutes'),controller.compareSerif);
router.get('/awesome-vs-glyph',apicache('45 minutes'), controller.compareIcon);
router.get('/t', apicache('1 day'),controller.getTree);




router.get('/', controller.index);
router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;