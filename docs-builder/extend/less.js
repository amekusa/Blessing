const less = require('less');

module.exports = function (handlebars) {

	/**
	 * Compiles `less:` subsections
	 */
	handlebars.registerHelper('less', function (format) {
		let r = '';
		let srcs = this.less.split(/-{3}\n/);
		let opts = {
			compress: false,
			processImports: true,
			syncImport: true,
			sync: true,
			async: false
		};

		for (let i = 0; i < srcs.length; i++) {
			let src = srcs[i].replace(/\t/g, '  '); // tab to 2 spaces
			let css = '';
			less.render(
				'@import (reference) "src/main.less";' + src, opts,
				function(error, result) {
					if (error) {
						css = '[ERROR] Less compiler: ' + error.message;
						console.error(css);
						return;
					}
					css = result.css;
				}
			);

			r += '<figure class="example">';
			r += 	'<figcaption>';
			r += 		'Example' + (srcs.length > 1 ? (' #' + (i + 1)) : '');
			r += 	'</figcaption>';
			r += 	'<div class="code-snippets">';
			r += 		'<pre class="prettyprint linenums lang-less source"><code data-language="less">' + src + '</code></pre>';
			r += 		'<pre class="prettyprint lang-css compiled"><code data-language="css">' + css + '</code></pre>';
			r += 	'</div>'
			r += '</figure>';

			less.render(
				'#kssref-' + this.referenceURI + ' .kss-modifier__example {' + css + '}', opts,
				function(error, result) {
					if (error) {
						css = '[ERROR] Less compiler: ' + error.message;
						console.error(css);
						return;
					}
					css = result.css;
				}
			);

			r += '<style>' + css + '</style>';
		}

		return new handlebars.SafeString(r);
	});

};
