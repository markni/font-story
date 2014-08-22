'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RecordSchema = new Schema({
	name: {type:String,required:true},
	repo: {type:String,required:true},
	user: {type:String,required:true},
	type: {type:String,required:true},
	fallbackof: String,
	dependon: String,
	created: Date,
	active: Boolean
});

module.exports = mongoose.model('Record', RecordSchema);