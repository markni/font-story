'use strict';

var _ = require('lodash');
var Record = require('./record.model');

// Get list of records
exports.index = function(req, res) {
  Record.find(function (err, records) {
    if(err) { return handleError(res, err); }
    return res.json(200, records);
  });
};

// Get a single record
exports.show = function(req, res) {
  Record.findById(req.params.id, function (err, record) {
    if(err) { return handleError(res, err); }
    if(!record) { return res.send(404); }
    return res.json(record);
  });
};

// Creates a new record in the DB.
exports.create = function(req, res) {
  Record.create(req.body, function(err, record) {
    if(err) { return handleError(res, err); }
    return res.json(201, record);
  });
};

// Updates an existing record in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Record.findById(req.params.id, function (err, record) {
    if (err) { return handleError(res, err); }
    if(!record) { return res.send(404); }
    var updated = _.merge(record, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, record);
    });
  });
};

// Deletes a record from the DB.
exports.destroy = function(req, res) {
  Record.findById(req.params.id, function (err, record) {
    if(err) { return handleError(res, err); }
    if(!record) { return res.send(404); }
    record.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


//compare the counts of serif and sans-serif font
exports.compareFonts = function(req,res){
	console.log('test?');
	var result = {};


	Record.count({$and:[{type:'generic'},{name:'serif'}]},function(err,count){
			if(err) { return handleError(res, err); }
			result['serif'] = count;


		Record.count({$and:[{type:'generic'},{name:'sans-serif'}]},function(err,count2){
			if(err) { return handleError(res, err); }

			result['sans-serif'] = count2;

			return res.json(result);



		})



	})


};



// Returns total count of entries
exports.getCount = function(req,res){

	Record.count({},function(err,count){
		if(err) { return handleError(res, err); }

		return res.json({count:count});

	});
};




// Returns top 50 most popular fonts
exports.getMostPopular = function(req,res){

	Record.aggregate([
		{$match:{type:'primary'}}
		,{$group:{_id:'$name',count:{$sum:1}}}
		,{$sort:{count:-1}}
		,{$limit:20}


	],function(err,records){

		if(err) { return handleError(res, err); }
		if(!records) { return res.send(404); }
		console.log(records);
		return res.json(records);


	});
};

// Find top 20 fallbacks for a given font
exports.getFallbacksByName = function(req,res){

	Record.aggregate([
		{$match:{fallbackof:req.params.name}}
		,{$group:{_id:'$name',count:{$sum:1}}}
		,{$sort:{count:-1}}
		,{$limit:20}


	],function(err,records){

		if(err) { return handleError(res, err); }
		if(!records) { return res.send(404); }
		console.log(records);
		return res.json(records);


	});

};



function handleError(res, err) {
	console.log(err);
  return res.send(500, err);
}