'use strict';

var path = {
	pack4ge: './package.json',
	src: './src',
	dist: './dist',
	docs: './docs'
};

var pack4ge = require(path.pack4ge);
var docs = require(path.docs + '/meta.json');

var gulp = require('gulp');
var g = require('gulp-load-plugins')();

var shell = require('child_process').exec;
var del = require('del');
var util = require('util');
var fs = require('fs');
var merge = require('merge');

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
		.pipe(g.rename(pack4ge.name + '.css'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('compress', ['compile'], function () {
	return gulp.src(path.dist + '/' + pack4ge.name + '.css')
		.pipe(g.minifyCss())
		.pipe(g.rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(path.dist));
});

gulp.task('docs.clean', function (done) {
	del([kssConf.destination + '/**/*'], done);
});

gulp.task('docs.deploy', ['docs'], function (done) {
	var remote = 'origin';
	var branch = 'gh-pages';
	g.git.exec({args: 'subtree push --prefix ' + kssConf.destination
			+ ' ' + remote + ' ' + branch}, function (error, stdout) {
		if (error !== null) console.log('' + error);
		else console.log(stdout);
		done();
	});
});

gulp.task('watch', function () {
	gulp.watch([
		path.src + '/**/*.less',
		path.pack4ge
	], ['compile']);

	gulp.watch([
		kssConf.source + '/' + kssConf.mask,
		kssConf.source + '/' + kssConf.homepage,
		kssConf.template + '/**/*.{html,txt,less,js}',
		path.kssConf
	], ['docs']);
});


var fn = {
	dump: function (variable) {
		console.log(util.inspect(variable, {showHidden: false, depth: null}));
	},
	dig: function (obj, paths) {
		for(var i = 0; i < paths.length; i++) {
			obj = obj[paths[i]] = obj[paths[i]] || {};
		}
		return obj;
	}
};

gulp.task('dss', function (done) {
	//return gulp.src('src/*.less')
	return gulp.src('src/test.less')
		.pipe(g.concat('index.less'))
		.pipe(g.intercept(function (file) {
			var dss = require('dss');
			
			dss.parser('namespace', function (i, line, block, file){
				return line.split('.');
			});
			
			dss.parse(file.contents.toString(), {}, function (data) {
				var root = { // The root
					
				};
				
				var node = function (base, paths) {
					for (var i = 0; i < paths.length; i++) {
						var iPath = paths[i];
						var iNode = null;
						if (!base.nodes) base.nodes = [];
						else {
							for (var j = 0; j < base.nodes.length; j++) {
								var jNode = base.nodes[j];
								if (jNode.name != iPath) continue;
								iNode = jNode;
								break;
							}
						}
						if (!iNode) {
							iNode = {name: iPath.charAt(0).toUpperCase() + iPath.slice(1)};
							base.nodes.push(iNode);
						}
						base = iNode;
					}
					return base;
				};
				
				data.blocks.forEach(function (iBlock, i) {
					var iNS = iBlock.namespace.concat(); // Clone array
					iNS.push(iBlock.name.toLowerCase()
						.replace(/^[^a-z]+/, '') // Trim leading symbols & numerals
						.replace(/[^a-z0-9]+$/, '') // Trim trailing symbols
						.replace(/[^a-z0-9]+/, '-')); // Replace symbols with a hyphen
					var iNode = node(root, iNS);
					iNode.doc = iBlock; // Store raw data
				});
				
				fn.dump(root);
				var ect = require('ect')(docs.template);
				file.contents = new Buffer(ect.render('layout', merge.recursive(true, docs.data, root)));
			});
			return file;
		}))
		.pipe(g.rename({extname: ".html"}))
		.pipe(gulp.dest(docs.dist));
});
