'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

var fs = require('fs');



// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

var Record = require('./api/record/record.model');

require('./planner');

//
//Record.find({}).remove(function(){
//	console.log('data removed');
//});

//Record.find({$and:[{name:new RegExp('.*fontawesome.*','i')},{type:'primary'}]}).remove(function(){
//	console.log('data removed');
//});


//backup
//Record.find().lean().exec(function (err, users) {
//	var str = JSON.stringify(users);
//	fs.writeFile("backup.json", str, function(err) {
//		if(err) {
//			console.log(err);
//		} else {
//			console.log("The file was saved!");
//		}
//	});
//
//});

//fs.readFile('backup.json',function (err,data){
//	if(err) throw err;
//	var content = JSON.parser(data);
//	Record.insert(content,function(){
//		console.log('import completed');
//
//	});
//
//});