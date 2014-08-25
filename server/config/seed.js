/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';


var User = require('../api/user/user.model');
var Record = require('../api/record/record.model');

Record.find({}).remove(function(){
	Record.create({
		name:'lato',
		user : 'xna2',
		repo : 'intouch2',
		type: 'primary',
    created: Date.now()
	},{
		name: 'helvetica neue',
		user : 'xna2',
		repo : 'intouch2',
		type: 'fallback',
		fallbackof:'lato',
		created: Date.now()
	},{
		name: 'helvetica neue',
		user : 'xna2',
		repo : 'intouch2',
		type: 'fallback',
		fallbackof:'lato',
		created: Date.now()
	},{
		name: 'serif',
		user : 'xna2',
		repo : 'intouch2',
		type: 'generic',
		fallbackof:'helvetic neue',
		created: Date.now()
	},{
		name: 'sans-serif',
		user : 'xna2',
		repo : 'intouch2',
		type: 'generic',
		fallbackof:'lato',
		created: Date.now()
	},{
		name: 'sans-serif',
		user : 'xna2',
		repo : 'intouch3',
		type: 'generic',
		fallbackof:'lato',
		created: Date.now()
	},{
		name: 'helvetica neue',
		user : 'xna2',
		repo : 'intouch2',
		type: 'fallback',
		fallbackof:'lato',
		created: Date.now()
	},function(err){
		console.log(err);
		console.log('finished populating github data');
	});





});


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
      console.log('finished populating users');
    }
  );
});