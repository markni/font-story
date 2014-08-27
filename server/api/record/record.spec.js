'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Record = require('./record.model');

var testData = [
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
	{name:'glyphicons halflings',user:'user a',repo:'repo a',type:'icon',created:Date.now()}
];

before(function(done) {
	this.timeout(15000);
	Record.find({}).remove(function(){
		Record.create(testData,function(err){
			console.log('Finished populate fake records');
			done();
		});
	});
});

describe('GET /api/records/fallbacks/:name', function() {

	it('should respond an empty list', function(done) {
		request(app)
			.get('/api/records/fallbacks/notafont')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				res.body.should.have.length(0);
				done();
			});
	});

	it('should respond a list with content', function(done) {
		request(app)
			.get('/api/records/fallbacks/font a')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				res.body.length.should.be.above(0);
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
				res.body[0]._id.should.be.equal('font a')

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
			res.body.count.should.be.equal(testData.length);

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
				res.body.serif.should.equal(testData.filter(function(record){return record.name==='serif'}).length);
				res.body['sans-serif'].should.equal(testData.filter(function(record){return record.name==='sans-serif'}).length);

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
				res.body.glyph.should.equal(testData.filter(function(record){return record.name==='glyphicons halflings'}).length);
				res.body.awesome.should.equal(testData.filter(function(record){return record.name==='fontawesome'}).length);

				done();
			});
	});
});