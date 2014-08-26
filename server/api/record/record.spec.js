'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Record = require('./record.model');


describe('GET /api/records/fallbacks/:name', function() {

	it('should respond get a list of fallback fonts with given font name', function(done) {
		request(app)
			.get('/api/records/fallbacks/lato')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				done();
			});
	});

});




describe('GET /api/records/top/:range', function() {

	it('should respond get a list of fonts sorted by usage', function(done) {
		request(app)
			.get('/api/records/top')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);

				done();
			});
	});

	it('should respond get a list of fonts created today that sorted by usage', function(done) {
		request(app)
			.get('/api/records/top/today')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);

				done();
			});
	});

});


describe('GET /api/records/count',function(){
	it('should respond get the total number of entry', function(done) {
	request(app)
		.get('/api/records/count')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.have.property('count');
			res.body.count.should.be.above(0);

			done();
		});
});
});


describe('GET /api/records/serif-vs-sans-serif',function(){
	it('should respond with count of sans-serif and serif', function(done) {
		request(app)
			.get('/api/records/serif-vs-sans-serif')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.have.property('serif');
				res.body.should.have.property('sans-serif');
				res.body.serif.should.be.above(0);
				res.body['sans-serif'].should.be.above(0);
				console.log(res.body);
				done();
			});
	});
});


describe('GET /api/records/awesome-vs-glyph',function(){
	it('should respond with count of fontawesome and glyphicons halfings', function(done) {
		request(app)
			.get('/api/records/awesome-vs-glyph')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.have.property('awesome');
				res.body.should.have.property('glyph');
				res.body.glyph.should.be.above(-1);
				res.body.awesome.should.be.above(-1);
				console.log(res.body);
				done();
			});
	});
});