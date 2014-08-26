'use strict';

var _ = require('lodash');
var Record = require('./record.model');
var Q = require('q');

// Get list of records
exports.index = function (req, res) {
	return res.send(404);
};

// Get a single record
exports.show = function (req, res) {
	Record.findById(req.params.id, function (err, record) {
		if (err) {
			return handleError(res, err);
		}
		if (!record) {
			return res.send(404);
		}
		return res.json(record);
	});
};

// Creates a new record in the DB.
exports.create = function (req, res) {
	Record.create(req.body, function (err, record) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(201, record);
	});
};

// Updates an existing record in the DB.
exports.update = function (req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Record.findById(req.params.id, function (err, record) {
		if (err) {
			return handleError(res, err);
		}
		if (!record) {
			return res.send(404);
		}
		var updated = _.merge(record, req.body);
		updated.save(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.json(200, record);
		});
	});
};

// Deletes a record from the DB.
exports.destroy = function (req, res) {
	Record.findById(req.params.id, function (err, record) {
		if (err) {
			return handleError(res, err);
		}
		if (!record) {
			return res.send(404);
		}
		record.remove(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.send(204);
		});
	});
};

//compare the counts of serif and sans-serif font
exports.compareSerif = function (req, res) {

	var result = {};

	Record.count({$and: [
		{type: 'generic'},
		{name: 'serif'}
	]}, function (err, count) {
		if (err) {
			return handleError(res, err);
		}
		result['serif'] = count;

		Record.count({$and: [
			{type: 'generic'},
			{name: 'sans-serif'}
		]}, function (err, count2) {
			if (err) {
				return handleError(res, err);
			}

			result['sans-serif'] = count2;

			return res.json(result);

		})

	})

};

//compare the counts of serif and sans-serif font
exports.compareIcon = function (req, res) {

	var result = {};

	Record.count({name: 'fontawesome'}, function (err, count) {
		if (err) {
			return handleError(res, err);
		}
		result['awesome'] = count;

		Record.count({name: 'glyphicons halflings'}, function (err, count2) {
			if (err) {
				return handleError(res, err);
			}

			result['glyph'] = count2;

			console.log(result);

			return res.json(result);

		})

	})

};

// Returns total count of entries
exports.getCount = function (req, res) {

	Record.count({}, function (err, count) {
		if (err) {
			return handleError(res, err);
		}

		return res.json({count: count});

	});
};

// Returns top 20 most popular fonts
exports.getMostPopular = function (req, res) {

	var query;
	var d = new Date();
	var yesterday = new Date(d.setDate(d.getDate() - 1));

	if (req.params && req.params.hasOwnProperty('range') && req.params.range === 'today') {
		console.log('---------------------------------------');

		query = {
			$and: [
				{type: 'primary'},
				{created: {$gte: yesterday, $lt: (new Date())}}
			]
		};

	}
	else {
		query = {type: 'primary'};
	}

	Record.aggregate([
		{$match: query}
		,
		{$group: {_id: '$name', count: {$sum: 1}}}
		,
		{$sort: {count: -1}}
		,
		{$limit: 20}

	], function (err, records) {

		if (err) {
			return handleError(res, err);
		}
		if (!records) {
			return res.send(404);
		}
		console.log(records);
		return res.json(records);

	});
};

// Find top 10 fallbacks for a given font
exports.getFallbacksByName = function (req, res) {

	Record.aggregate([
		{$match: {fallbackof: req.params.name}}
		,
		{$group: {_id: '$name', count: {$sum: 1}}}
		,
		{$sort: {count: -1}}
		,
		{$limit: 10}

	], function (err, records) {

		if (err) {
			return handleError(res, err);
		}
		if (!records) {
			return res.send(404);
		}
		console.log(records);
		return res.json(records);

	});

};

exports.getTree = function (req, res) {

	var first = [
		{name: 'serif', children: []},
		{name: 'sans-serif', children: []}
	];
	var second = [];
	var third = [];

	var aggregate = Q.nbind(Record.aggregate, Record);
	var promises = [];
	promises.push(aggregate({$match: {dependon: 'serif'}}
		, {$group: {_id: '$name', count: {$sum: 1}}}
		, {$sort: {count: -1}}
		, {$limit: 5}
	));
	promises.push(aggregate({$match: {dependon: 'sans-serif'}}
		, {$group: {_id: '$name', count: {$sum: 1}}}
		, {$sort: {count: -1}}
		, {$limit: 15}
	));

	return Q.all(promises).then(function (subtrees) {
		second = subtrees;
		var flattend = subtrees[0].concat(subtrees[1]);

		var newPromises = flattend.map(function (leaf) {
			return aggregate({$match: {dependon: leaf['_id']}}
				, {$group: {_id: '$name', count: {$sum: 1}}}
				, {$sort: {count: -1}}
				, {$limit: 5}
			)
		});

		return Q.all(newPromises);

	}).done(function (docs) {
			third = docs;
			for (var i = 0; i < second.length; i++) {
				var subRes = [];
				for (var x = 0; x < second[i].length; x++) {
					var obj = {};
					var targetTree = third[i * second.length + x];
					obj.name = second[i][x]._id;
					obj.children = [];
					targetTree.forEach(function (leaf) {
						obj.children.push({name: leaf._id, size: leaf.count});
					});

					first[i].children.push(obj);

				}
			}

			return res.json(first);

		})

};

function handleError(res, err) {
	console.log(err);
	return res.send(500, err);
}