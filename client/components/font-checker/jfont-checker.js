'use strict';

var fontcheckerA;
var fontcheckerB;

function createSpan() {
	fontcheckerA = document.createElement('span');
	(document.body).appendChild(fontcheckerA);
	fontcheckerA.style.fontFamily = 'Arial,monospace';
	fontcheckerA.style.margin = '0px';
	fontcheckerA.style.padding = '0px';
	fontcheckerA.style.fontSize = '32px';
	fontcheckerA.style.position = 'absolute';
	fontcheckerA.style.top = '-999px';
	fontcheckerA.style.left = '-999px';
	fontcheckerA.innerHTML = 'Font Checker SPAN-A';
	fontcheckerB = document.createElement('span');
	(document.body).appendChild(fontcheckerB);
	fontcheckerB.style.fontFamily = 'Arial,monospace';
	fontcheckerB.style.margin = '0px';
	fontcheckerB.style.padding = '0px';
	fontcheckerB.style.fontSize = '32px';
	fontcheckerB.style.position = 'absolute';
	fontcheckerB.style.top = '-999px';
	fontcheckerB.style.left = '-999px';
	fontcheckerB.innerHTML = 'Font Checker SPAN-B';
}

function checkfont(font) {
	createSpan();
	var txt = 'ERROR';
	fontcheckerA.style.fontFamily = font + ',monospace';
	fontcheckerB.style.fontFamily = 'monospace';
	fontcheckerA.innerHTML = 'random_words_#_!@#$^&*()_+mdvejreu_RANDOM_WORDS';
	fontcheckerB.innerHTML = fontcheckerA.innerHTML;
	if (parseInt(fontcheckerA.offsetWidth, 10) === parseInt(fontcheckerB.offsetWidth, 10) && Number(fontcheckerA.offsetHeight) === Number(fontcheckerB.offsetHeight)) {
		fontcheckerA.style.fontFamily = font + ',Arial';
		fontcheckerB.style.fontFamily = 'Arial';
		if (Number(fontcheckerA.offsetWidth) === Number(fontcheckerB.offsetWidth) && Number(fontcheckerA.offsetHeight) === Number(fontcheckerB.offsetHeight)) {
			txt = false;
		} else {
			txt = true;
		}
	} else {
		txt = true;
	}
	//DELETE TESTING ELEMENTS
	fontcheckerA.innerHTML = '';
	fontcheckerA.outerHTML = '';
	fontcheckerB.innerHTML = '';
	fontcheckerB.outerHTML = '';

	return txt;
}

checkfont('');

