'use strict';

var service;

var GithubApi = require('github');
var Q = require('q');

var config = require('./config/environment');

var github = new GithubApi({
	// required
	version: "3.0.0",
	// optional
	debug: false,
	protocol: "https",

	timeout: 5000
});

function getMatches(string, regex, index) {
	//todo:move this to helpers

	//helper function to grab subgroup matches from regex;

	if (!index) {
		index = 1
	} // default to the first capturing group
	var matches = [];
	var match;
	while ((match = regex.exec(string))) {
		matches.push(match[index]);
	}
	return matches;
}


function isStyleFile(file) {
	//todo:move this to helpers

	//check if the file is a css/less/sass file.

	//exclude .min.css etc as it's reaptead content of a css file.

	return (file.path.match(/(.less|.css|.sass|.scss)$/mi) !== null && file.path.match('.min.') === null);

}

github.authenticate({
	type: "oauth",
	key: config.github.clientID,
	secret: config.github.clientSecret
});

service = module.exports = {
	getFontsFromPublicEvents: function () {

		//wrapping github API method in Q.

		var getPublicEvents = Q.nbind(github.events.get, github.events);
		var getReference = Q.nbind(github.gitdata.getReference, github.gitdata);
		var getTree = Q.nbind(github.gitdata.getTree, github.gitdata);
		var getContent = Q.nbind(github.repos.getContent, github.repos);

		//Do the work step by step

		//Get first page of public events

		var user_repo_map = [];

		getPublicEvents({page: 1}).then(function (events) {

			//scan each event

			//we only care about heads/master version
			var ref = 'heads/master';

			//testing methd to save some api calls
			events = events.splice(0, 5);

			var promises = events.map(function (event) {

				//get user name and repo name from event

				var user = event.repo.name.split('/')[0];
				var repo = event.repo.name.split('/')[1];

				console.log(event);

				user_repo_map.push({user:user,repo:repo});

				//test empty repo
//				user = 'xna2';
//				repo = 'empty';

//				test empty repo
//				user = 'xna2';
//				repo = 'intouch2';

				console.log(user + '/' + repo);

				//grab heads/master's sha to process

				return getReference({user: user, repo: repo, ref: ref}).then(function (ref) {
					var sha = ref.object.sha;
					console.log('are we eaven herer?');
					console.log(sha);
					return    getTree({user: user, repo: repo, sha: sha, recursive: true}).then(function (res) {

						//get a list of files.

						var tree = res.tree;
						var promises = tree.filter(isStyleFile).map(function (file) {

							return getContent({user: user, repo: repo, path: file.path});

							//return Q(undefined);

						});
						return Q.all(promises);

					});
				});
			});
			return Q.allSettled(promises);
		})

			.catch(function (error) {

				console.log('Opps, something went wrong.');
				console.log(error);

				// Handle any error from all above steps
			})
			.done(function (res) {

//				console.log('group.length:' + groups.length);
//
//				console.log(groups);

				var groups = [];

				res.forEach(function(res){
					if (res.state === 'fulfilled'){
						groups.push(res.value);
					}
					else{
						console.log(res.reason);
					}

				});

				var results = [];

				groups.forEach(function (files, i) {

					var r_user =   user_repo_map[i].user;
					var r_repo =   user_repo_map[i].repo;

					files.forEach(function (file) {

						var r_created = new Date(file.meta['last-modified']);



						var content = file.content;

						if (content) {

//							console.log(file);

							var css_plain_text = new Buffer(file.content, 'base64').toString('utf-8');
							var regex = /font-family:(((?![;]{1,}).)*);/gmi;
							var found = getMatches(css_plain_text, regex, 1);

							if (found.length) {

								found.forEach(function (fontFamily) {

									//unify font names then split into an array;
									var fonts = fontFamily.replace(/\\/g, '').replace(/'/g, '').replace(/"/g, '').toLowerCase().split(',');
									for (var i = 0; i < fonts.length; i++) {
										//trims spalce
										fonts[i] = fonts[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
									}

									fonts = fonts.filter(function (font) {

										if (font.search('@') !== -1) {

											//todo:handle sass/less variable, return false for now
											return false;
										}

										return true;

									});
									fonts.forEach(function (font,i) {
										var record = {};
										record['name'] = font;
										record['repo'] = r_repo;
										record['user'] = r_user;
										record['created'] = r_created;

										if(fonts.length === 1 || i === 0){
											//if only one font listed for font-family
											record.type = 'primary';


										}
										else{
											//more than one fonts listed;
											record.type = 'fallback';
											record.fallbackof  = fonts[0];


										}

										results.push(record);
//
//										result['primary'].push(font);

									})
								})

							}

						}

					});



				});
				console.log(results);
				console.log('WE ARE DOONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNE');
			}

		);

	}



};

console.log('Geting public events.....');
service.getFontsFromPublicEvents();
