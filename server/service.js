'use strict';

var service;

var GithubApi = require('github');
var Q = require('q');
var Record = require('./api/record/record.model');
var Helper = require('./helper.js');
var Parser = require('./parser.js');

var config = require('./config/environment');

var github = new GithubApi({
	// required
	version: "3.0.0",
	// optional
	debug: false,
	protocol: "https",

	timeout: 5000
});

github.authenticate({
	type: "oauth",
	key: config.github.clientID,
	secret: config.github.clientSecret
});

//wrapping github API methods in Q.

var getPublicEvents = Q.nbind(github.events.get, github.events);
var getReference = Q.nbind(github.gitdata.getReference, github.gitdata);
var getTree = Q.nbind(github.gitdata.getTree, github.gitdata);
var getContent = Q.nbind(github.repos.getContent, github.repos);
var getRateLimit = Q.nbind(github.misc.rateLimit, github.misc);

service = module.exports = {

	checkRateLimit: function (res) {
		// check if we have enough api calls left

		var remaining = res.rate.remaining;
		if (remaining && remaining > 2000) {
			console.log(remaining+', OK...');
			return  getPublicEvents({page: 1});
		}
		else {
			return Q.reject({message: 'Not enough API calls left...'});
		}

	},

	getContentsFromEvents: function (events,user_repo_map) {


		//scan each event

		//we only care about heads/master version
		var ref = 'heads/master';

		//testing methd to save some api calls
//		events = events.splice(0, 5);

		var promises = events.map(function (event) {

			//get user name and repo name from event

			var user = event.repo.name.split('/')[0];
			var repo = event.repo.name.split('/')[1];

			user_repo_map.push({user: user, repo: repo});

			//grab heads/master's sha to process

			return getReference({user: user, repo: repo, ref: ref}).then(function (ref) {
				var sha = ref.object.sha;
				return    getTree({user: user, repo: repo, sha: sha, recursive: true}).then(function (res) {

					//get a list of files.

					var tree = res.tree;
					var promises = tree.filter(Parser.isStyleFile).map(function (file) {

						return getContent({user: user, repo: repo, path: file.path});

						//return Q(undefined);

					});
					return Q.all(promises);

				});
			});
		});
		return Q.allSettled(promises);

	},

	getFontsFromPublicEvents: function () {


		//Do the work step by step

		//Get first page of public events

		var user_repo_map = [];

		getRateLimit({

		}).then(function (res) {

				console.log('Checking API limit...');
				return service.checkRateLimit(res);

			}).then(function (events) {

				console.log('Get Contents...');

				return service.getContentsFromEvents(events,user_repo_map);

			}).catch(function (error) {

				console.log('Opps, something went wrong...');
				console.log(error);

				// Handle any error from all above steps
			}).done(function (res) {
				console.log('Finally....');


				if (!res) {
					return;
				}

				console.log('Processing files...');

				var groups = [];

				res.forEach(function (res) {
					if (res.state === 'fulfilled') {
						groups.push(res.value);
					}
					else {
						console.log(res.reason);
					}

				});

				var results = [];

				groups.forEach(function (files, i) {

					var r_user = user_repo_map[i].user;
					var r_repo = user_repo_map[i].repo;

					files.forEach(function (file) {

						var r_created = new Date(file.meta['last-modified']);

						var content = file.content;

						if (content) {



							var css_plain_text = new Buffer(file.content, 'base64').toString('utf-8');
							var regex = /font-family:(((?![;]{1,}).)*);/gmi;
							var found = Helper.getMatches(css_plain_text, regex, 1);

							if (found.length) {

								found.forEach(function (fontFamily) {

									//unify font names then split into an array;
									var fonts = fontFamily.replace(/\\/g, '').replace(/'/g, '').replace(/"/g, '').toLowerCase().split(',');
									for (var i = 0; i < fonts.length; i++) {
										//remove important
										fonts[i] = fonts[i].replace('!important','');
										//trims spalce

										fonts[i] = fonts[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
									}

									fonts = fonts.filter(function (font) {

										if (font.search(/^[-a-z ]+$/gm) === -1 || font.search('inherit') !== -1) {

											//todo:handle non-english font
											//todo:handle sass/less variable, return false for now
											return false;
										}
										return true;
									});



									fonts.forEach(function (font, i) {
										var record = {};
										record.name = font;
										record.repo = r_repo;
										record.user = r_user;
										record.created = r_created;

										if (fonts.length === 1 || i === 0) {
											//if only one font listed for font-family
											record.type = 'primary';

										}
										else {
											//more than one fonts listed;
											record.type = 'fallback';

											record.fallbackof = fonts[i - 1];

										}

										if (Parser.isGeneric(font)) {
											record.type = 'generic';
										}

										if (Parser.isIcon(font)) {
											record.type = 'icon';
										}

										if (fonts.length - 1 > i) {
											record.dependon = fonts[i + 1];
										}

										results.push(record);

										var r = new Record(record);

										r.save(function (err) {
											if (err) {
												console.log(err);
											}
										});

									})
								})

							}

						}

					});

				});
				console.log('Fetching public data completed. There are ' + results.length + ' new records have been stored.');
			}

		);

	}



};

