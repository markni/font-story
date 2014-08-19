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

function getRepoInfoByUrl(url) {
	//split the url and get repo name and user name

	//todo:move this to helpers

	var url_arr = url.split('/');
	if (url_arr[3] === 'repos') {
		return {user: url_arr[4], repo: url_arr[5]};
	}
	return null;
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

		getPublicEvents({page: 1}).then(function (events) {

			//scan each event

			//we only care about heads/master version
			var ref = 'heads/master';

			//testing methd to save some api calls
			events = events.splice(0, 2);

			var promises = events.map(function (event) {

				//get user name and repo name from event

				var user = event.repo.name.split('/')[0];
				var repo = event.repo.name.split('/')[1];

				//test
//				user = 'xna2';
//				repo = 'intouch2';

				console.log(user+'/'+repo);

				//grab heads/master's sha to process

				return getReference({user: user, repo: repo, ref: ref}).then(function (ref) {
					var sha = ref.object.sha;
					return    getTree({user: user, repo: repo, sha: sha, recursive: true});
				});
			});
			return Q.all(promises);
		})
			.then(function (trees) {

				console.log('forest.length'+tress.length);

				//get a list of files.
				var BigPromises = tress.map(function (res) {
					var tree = res.tree;
					var promises = tree.filter(isStyleFile).map(function (file) {
						console.log(file.url);
						var options = getRepoInfoByUrl(file.url);
						options.path = file.path;

						console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
						console.log(options);

						return getContent(options);

//					return Q(undefined);

					});

					console.log(promises.length);

					return Q.all(promises);

				});


				return Q.all(BigPromises);

				//find css/less/scss files and parse their contents



			})
			.catch(function (error) {

				console.log('Opps, something went wrong.');
				console.log(error);

				// Handle any error from all above steps
			})
			.done(function (groups) {

				console.log('group.length:'+groups.length);

				groups.forEach(function (files) {

					files.forEach(function (file) {

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

									fonts = fonts.filter(function(font){

										if(font.search('@')!==-1){
											return false;
										}




										return true;


									});
									console.log('-----------------------');
									console.log(fonts);

									console.log('-----------------------');
								})

							}

						}

					});

				});
				console.log('WE ARE DOONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNE');
			}

		);

	}



};


console.log('Geting public events.....');
service.getFontsFromPublicEvents();
