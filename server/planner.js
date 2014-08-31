'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');




var schedule = require('node-schedule');
var Service = require('./service');

var rule = new schedule.RecurrenceRule();
rule.minute = [0, 7, 15, 25, 30, 40, 45, 50, 55];

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

console.log('Starting fetching data from github...');
console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
console.log('process.env.GITHUB_ID = ' + process.env.GITHUB_ID);

var j = schedule.scheduleJob(rule, function () {

	Service.getFontsFromPublicEvents();

});




