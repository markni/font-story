'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Record = require('./record.model');


describe('GET /api/records', function() {




  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/records')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});


describe('GET /api/records/fallbacks/:name', function() {

	it('should respond get a list of fallback fonts with given font name', function(done) {
		request(app)
			.get('/api/records/fallbacks/lato')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				res.body.should.have.length(2);
				done();
			});
	});

});




describe('GET /api/records/top', function() {

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

});