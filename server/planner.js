var schedule = require('node-schedule');
var Service = require('./service');


var rule = new schedule.RecurrenceRule();
rule.minute = [0,15,30,45,47,49,51,52,53,54,55,56,3,4,5,6,7,8,9,20,25,31,32,33,34];

var j = schedule.scheduleJob(rule, function(){
	console.log('The answer to life, the universe, and everything!');

//	Service.getFontsFromPublicEvents();

});


//setInterval(function(){
//
//	console.log('Planing.....');
//	Service.getFontsFromPublicEvents();
//
//
//},600000);