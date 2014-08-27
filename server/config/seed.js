/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';


var User = require('../api/user/user.model');
var Record = require('../api/record/record.model');

Record.find({}).remove(function(){
	Record.create([
		{name:'font a',user:'user a',repo:'repo a',type:'primary',dependon:'font b',created:Date.now()},
		{name:'font a',user:'user a',repo:'repo a',type:'primary',dependon:'font c',created:Date.now()},
		{name:'font b',user:'user a',repo:'repo a',type:'fallback',fallbackof:'font a',dependon:'serif',created:Date.now()},
		{name:'font c',user:'user a',repo:'repo a',type:'fallback',fallbackof:'font a',dependon:'serif',created:Date.now()},
		{name:'serif',user:'user a',repo:'repo a',type:'generic',fallbackof:'font b',created:Date.now()},
		{name:'serif',user:'user a',repo:'repo a',type:'generic',fallbackof:'font c',created:Date.now()},

		{name:'font d',user:'user a',repo:'repo a',type:'primary',dependon:'font e',created:Date.now()},
		{name:'font e',user:'user a',repo:'repo a',type:'fallback',fallbackof:'font d',dependon:'sans-serif',created:Date.now()},
		{name:'sans-serif',user:'user a',repo:'repo a',type:'generic',fallbackof:'font e',created:Date.now()},

		{name:'fontawesome',user:'user a',repo:'repo a',type:'icon',created:Date.now()},
		{name:'fontawesome',user:'user a',repo:'repo a',type:'icon',created:Date.now()},
		{name:'glyphicon halflings',user:'user a',repo:'repo a',type:'icon',created:Date.now()}


	],function(err){
		console.log('Finished populate fake records');
	});





});

//TODO: REMOVE UNUSED USER MODEL


User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('Finished populating users');
    }
  );
});