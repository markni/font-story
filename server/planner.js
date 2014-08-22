var schedule = require('node-schedule');

var Service = require('./service');

var rule = new schedule.RecurrenceRule();
rule.minute = [0,15,30,45];

var j = schedule.scheduleJob(rule, function(){
	console.log('The answer to life, the universe, and everything!');
});