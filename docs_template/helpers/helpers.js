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
			r += '<figure class="example">';
			r += 	'<figcaption>';
			r += 		srcs.length > 1 ? ('Example #' + (i + 1)) : 'Example';
			r += 	'</figcaption>';
			r += 	'<div class="code-snippets">';
			r += 		'<pre class="prettyprint linenums lang-less source"><code data-language="less">' + srcs[i] + '</code></pre>';
			r += 		'<pre class="prettyprint lang-css compiled"><code data-language="css">' + iCss + '</code></pre>';
			r += 	'</div>'
			r += '</figure>';
			// ] HTML

			less.render(
				'#kssref-' + this.referenceURI + '{' + iCss + '}', opts,
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
			r += '<style>' + iCss + '</style>';
			// ] HTML
		}

		return new handlebars.SafeString(r);
	});

};
