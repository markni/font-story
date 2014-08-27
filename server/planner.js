var schedule = require('node-schedule');
var Service = require('./service');


var rule = new schedule.RecurrenceRule();
rule.minute = [0,7,15,25,30,40,45,50,55];

  if(process.env.NODE_ENV.toLowerCase() !== 'development')  {
		var j = schedule.scheduleJob(rule, function(){
			Service.getFontsFromPublicEvents();

		});



	}
