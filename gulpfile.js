'use strict';

var path = {
	pkg: 'package.json',
	src: 'src',
	dist: 'dist',
	docs: 'docs',
	docsTemplates: 'docs_templates'
};

var pkg = require('./' + path.pkg);
var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var series = require('run-sequence'); // TODO Replace with gulp.series on Gulp 4.0 release
var bsync = require('browser-sync');
var shell = require('child_process').exec;
var del = require('del');
var util = require('util');
var fs = require('fs');
var merge = require('merge');

var fn = {
	dump: function (variable) {
		console.log(util.inspect(variable, {showHidden: false, depth: null}));
	},
	dig: function (obj, paths) {
		for (var i = 0; i < paths.length; i++) {
			obj = obj[paths[i]] = obj[paths[i]] || {};
		}
		return obj;
	}
};

gulp.task('default', ['build', 'docs', 'watch']);
gulp.task('build', ['compile', 'compress']);

gulp.task('compile', function () {
	return gulp.src(path.src + '/main.less')
		.pipe(g.sourcemaps.init())
		.pipe(g.less({
			sourceMap: true
		}))
		.pipe(g.cssPurge())
		.pipe(g.autoprefixer('last 2 versions'))
		.pipe(g.sourcemaps.write())
		.pipe(g.rename(pkg.name + '.css'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('compress', ['compile'], function () {
	return gulp.src(path.dist + '/' + pkg.name + '.css')
		.pipe(g.minifyCss())
		.pipe(g.rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(path.dist));
});

gulp.task('docs.clean', function (done) {
	return del([path.docs + '/**/*'], done);
});

gulp.task('docs.deploy', ['docs'], function (done) {
	return gulp.src(path.docs + '/**/*')
		.pipe(g.ghPages());
});

gulp.task('watch', function () {
	bsync.init({
		server: {
			baseDir: path.docs
		}
	})

	gulp.watch([
		path.src + '/**/*.less',
		path.pkg
	], ['compile']);

	gulp.watch([
		path.src + '/**/*.less',
		path.docsTemplates + '/**/*'
	], ['docs']);
});

gulp.task('docs', ['docs.clean'], function (done) {
	// return gulp.src('src/*.less')
	return gulp.src('src/test.less')
		.pipe(g.concat('index.less'))
		.pipe(g.intercept(function (file) {
			var dss = require('dss');

			dss.parser('namespace', function (i, line, block, file) {
				return line.split('.');
			});

			dss.parse(file.contents.toString(), {}, function (data) {

				// Data tree to be passed to templates
				var tree = {
					title: 'Blessing'
				};

				// Creates a node
				var node = function (trunk, paths) {
					for (var i = 0; i < paths.length; i++) {
						var iPath = paths[i];
						var iNode = null;
						if (!trunk.nodes) trunk.nodes = [];
						else {
							for (var j = 0; j < trunk.nodes.length; j++) {
								var jNode = trunk.nodes[j];
								if (jNode.name.toLowerCase() != iPath) continue;
								iNode = jNode;
								break;
							}
						}
						if (!iNode) {
							iNode = {name: iPath.charAt(0).toUpperCase() + iPath.slice(1)};
							trunk.nodes.push(iNode);
						}
						trunk = iNode;
					}
					return trunk;
				};

				// Template system
				var ect = require('ect')({
					root: path.docsTemplates,
					ext: '.ect'
				});

				// Creates HTMLs from tree nodes
				var html = function recurse(node) {
					if (node.content) {
						fs.writeFileSync(
							path.docs + '/' + node.content.namespace.join('-') + '.html',
							ect.render('layout', node)
						);
					}
					if (!node.nodes) return;
					node.nodes.forEach(recurse);
				};

				// Stores the parsed data chunks into the tree
				data.blocks.forEach(function (iBlock, i) {
					var iNS = iBlock.namespace.concat(); // Clone array
					iNS.push(iBlock.name.toLowerCase()
						.replace(/^[^a-z]+/, '') // Trim leading symbols & numerals
						.replace(/[^a-z0-9]+$/, '') // Trim trailing symbols
						.replace(/[^a-z0-9]+/, '-')); // Replace symbols with a hyphen

					var iNode = node(tree, iNS);
					iNode.content = iBlock; // Store raw data
				});

				// Dumps the tree for debug
				fs.writeFileSync(
					path.docs + '/data.json',
					JSON.stringify(tree, null, "\t")
				);

				// Creates HTMLs
				html(tree);
			});
			return file;
		}))
		.pipe(g.rename({extname: ".html"}))
		.pipe(gulp.dest(path.docs));
});
