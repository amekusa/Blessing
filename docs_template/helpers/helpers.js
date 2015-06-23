'use strict';

var less = require('less');

module.exports.register = function(handlebars) {

	/**
	 * Compiles `less:` subsections
	 */
	handlebars.registerHelper('less', function(format) {
		var r = '';
		var srcs = this.less.split(/-{3}\n/);
		var opts = {
			compress: false,
			processImports: true,
			syncImport: true,
			sync: true,
			async: false
		};

		for (var i = 0; i < srcs.length; i++) {
			var iCss = '';
			less.render(
				'@import (reference) "src/main.less";' + srcs[i], opts,
				function(error, result) {
					if (error) {
						iCss = '[ERROR] Less compiler: ' + error.message;
						console.log(iCss);
						return;
					}
					iCss = result.css;
				}
			);
			
			// HTML [
			r += '<div class="kss-modifier__wrapper">';
			r += 	'<div class="kss-modifier__heading kss-style">';
			r += 		srcs.length > 1 ? ('Example #' + (i + 1)) : 'Example';
			r += 	'</div>';
			//r += 	'<div class="kss-modifier__example">' + srcs[i] + '</div>';
			r += 	'<div class="kss-modifier__example kss-markup kss-style">';
			r += 		'<pre class="prettyprint linenums lang-less"><code data-language="less">' + srcs[i] + '</code></pre>';
			r += 	'</div>';
			r += '</div>'
			r += '<div class="kss-markup kss-style">';
			r += 	'<pre class="prettyprint linenums lang-css"><code data-language="css">' + iCss + '</code></pre>';
			r += '</div>';
			// ] HTML
		}

		return new handlebars.SafeString(r);
	});

};