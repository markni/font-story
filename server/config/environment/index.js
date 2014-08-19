'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
	if (!process.env[name]) {
		throw new Error('You must set the ' + name + ' environment variable');
	}
	return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
	env: process.env.NODE_ENV,

	// Root path of server
	root: path.normalize(__dirname + '/../../..'),

	// Server port
	port: process.env.PORT || 9000,

	// Should we populate the DB with sample data?
	seedDB: false,

	// Secret for session, you will want to change this and make it an environment variable
	secrets: {
		session: 'font-story-secret'
	},

	// List of user roles
	userRoles: ['guest', 'user', 'admin'],

	// MongoDB connection options
	mongo: {
		options: {
			db: {
				safe: true
			}
		}
	},

	facebook: {
		clientID: process.env.FACEBOOK_ID || 'id',
		clientSecret: process.env.FACEBOOK_SECRET || 'secret',
		callbackURL: process.env.DOMAIN + '/auth/facebook/callback'
	},

	twitter: {
		clientID: process.env.TWITTER_ID || 'id',
		clientSecret: process.env.TWITTER_SECRET || 'secret',
		callbackURL: process.env.DOMAIN + '/auth/twitter/callback'
	},

	google: {
		clientID: process.env.GOOGLE_ID || 'id',
		clientSecret: process.env.GOOGLE_SECRET || 'secret',
		callbackURL: process.env.DOMAIN + '/auth/google/callback'
	},

	github:{
		clientID: process.env.GITHUB_ID || 'ef9e8a14dc67c952825e',
		clientSecret: process.env.GITHUB_SECRET || 'b812bdc457f0b718339847e52c01e67814e9d94c',
		callbackURL: process.env.DOMAIN + '/auth/github/callback'
	}

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
	all,
	require('./' + process.env.NODE_ENV + '.js') || {});