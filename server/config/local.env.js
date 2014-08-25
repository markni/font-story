'use strict';

// Environment variables that grunt will set when the server starts locally. Use for your api keys, secrets, etc.
// You will need to set these on the server you deploy to.
//
// This file should not be tracked by git.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "fontstory-secret",

  FACEBOOK_ID: 'app-id',
  FACEBOOK_SECRET: 'secret',

  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',

  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

	GITHUB_ID: 'ef9e8a14dc67c952825e',
	GITHUB_SECRET: 'b812bdc457f0b718339847e52c01e67814e9d94c',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
