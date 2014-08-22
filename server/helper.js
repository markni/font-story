'use strict';
var helper = module.exports = {
	getMatches : function (string, regex, index) {
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


};