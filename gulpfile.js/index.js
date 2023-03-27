/*!
 * gulp tasks for blessing
 * @author amekusa
 */

const { dirname } = require('node:path');
const bsync = require('browser-sync').create();
const u = require('./lib/util');

const g = require('gulp');
const s = g.series;
const p = g.parallel;

const base = dirname(__dirname);
const pkg = require(base + '/package.json');
const paths = {
	src: {
		base: base + '/src',
		file: '*.less'
	},
	docs: {
		base: base + '/docs',
		config: base + '/kss.json',
		builder: base + '/docs_builder'
	}
};

const t = { // minor tasks

	docs_gen() {
		let dst = paths.docs.base + '/' + pkg.version;
		let args = {
			'--config': paths.docs.config,
			'--source': paths.src.base,
			'--mask': paths.src.file,
			'--destination': dst,
			'--builder': paths.docs.builder,
			'--extend': paths.docs.builder + '/extend',
		};
		return u.exec(`kss ${u.args(args)} && cd '${paths.docs.base}' && ln -sfn '${pkg.version}' latest`).then(log => {
			if (log) console.log(log);
		});
	},

	docs_run(resolve) {
		return bsync.init({
			watch: true,
			server: {
				baseDir: paths.docs.base + '/latest',
				index: 'index.html'
			}
		}, resolve);
	},

	docs_clean() {
		return u.rm(paths.docs.base);
	},

	docs_gen_watch() {
		return g.watch([
			paths.src.base + '/' + paths.src.file,
			paths.docs.config,
			paths.docs.builder,
			base + '/README.md',
		], t.docs_gen)
	},

};

// major tasks
const x = {
	...t,
	docs: s(
		t.docs_clean,
		t.docs_gen,
		t.docs_run
	),
	docs_watch: s(
		t.docs_clean,
		t.docs_gen,
		p(
			t.docs_run,
			t.docs_gen_watch
		)
	),
};

module.exports = x;
