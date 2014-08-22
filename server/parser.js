'use strict';
var parser = module.exports = {
	isStyleFile: function (file) {


		//check if the file is a css/less/sass file.

		//exclude .min.css etc as it's reaptead content of a css file.

		return (file.path.match(/(.less|.css|.sass|.scss)$/mi) !== null && file.path.match('.min.') === null);

	},

	isGeneric:function(font){

		//check if the font is css generic font;

		var generic_fonts = ['serif','sans-serif','fantasy','monospace','cursive'];

		return  (generic_fonts.indexOf(font) !== -1);



	}


};