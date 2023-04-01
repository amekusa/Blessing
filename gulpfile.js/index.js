/*!
 * gulp tasks for blessing
 * @author amekusa
 */

const /* gulp */
	rename = require('gulp-rename'), // you need this, sadly
	g = require('gulp'),
	s = g.series,
	p = g.parallel;

const { dirname } = require('node:path');
const bsync = require('browser-sync').create();
const less = require('less');
const u = require('./lib/util');

const base = dirname(__dirname);
const pkg = require(base + '/package.json');

const t = { // tasks

	docs_theme_css() {
		let src = base + '/docs-theme/main.less';
		let dst = base + '/docs/latest/assets';
		let opts = {
			compress: false,
		};
		return g.src(src)
			.pipe(u.modify(data => less.render(data, opts).then(r => r.css)))
			.pipe(rename('theme.css'))
			.pipe(g.dest(dst));
	},

	docs_theme_css_watch() {
		// activate live-reload
		bsync.watch(base + '/docs/latest/assets/*.css', (ev, file) => {
			if (ev != 'change') return;
			console.log('file changed:', file);
			bsync.reload('*.css');
		});
		return g.watch([
			base + '/src/**/*.less',
			base + '/docs-theme/**/*.less',
		], t.docs_theme_css);
	},

	docs_clean() {
		return u.rm(base + '/docs');
	},

	docs_gen() {
		let dst = base + '/docs/' + pkg.version;
		let args = {
			'--config': base + '/kss.json',
			'--source': base + '/src',
			'--mask': '**/*.less',
			'--destination': dst,
			'--builder': base + '/docs-builder',
		};
		return u.exec(`kss ${u.args(args)} && cd '${base}/docs' && ln -sfn '${pkg.version}' latest`).then(log => {
			if (log) console.log(log);
			if (bsync.active) bsync.reload();
		});
	},

	docs_gen_watch() {
		return g.watch([
			base + '/src',
			base + '/kss.json',
			base + '/docs-builder',
			base + '/README.md',
		], t.docs_gen);
	},

	docs_run(resolve) {
		return bsync.init({
			open: false,
			server: {
				baseDir: base + '/docs/latest',
				index: 'index.html'
			}
		}, resolve);
	},

};

// major tasks
const x = { ...t };
x.docs_theme = t.docs_theme_css;
x.docs = s(
	t.docs_clean,
	t.docs_gen,
	x.docs_theme,
);
x.docs_watch = s(
	x.docs,
	p(
		t.docs_run,
		t.docs_gen_watch,
	)
);
x.docs_theme_watch = s(
	x.docs,
	p(
		t.docs_run,
		t.docs_theme_css_watch,
	)
);

module.exports = x;
