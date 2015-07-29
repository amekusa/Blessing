var paths = {
	package: './package.json',
	kssConf: './kss-config.json',
	src: './src',
	dist: './dist'
};

var package = require(paths.package);
var project = package.name.toLowerCase();
var kssConf = require(paths.kssConf);

var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var shell = require('child_process').exec;
var del = require('del');
var util = require('util');
var fs = require('fs');

gulp.task('default', ['build', 'docs', 'watch']);
gulp.task('build', ['compile', 'compress']);

gulp.task('compile', function() {
	return gulp.src(paths.src + '/main.less')
		.pipe(g.sourcemaps.init())
		.pipe(g.less({
			sourceMap: true
		}))
		.pipe(g.cssPurge())
		.pipe(g.autoprefixer('last 2 versions'))
		.pipe(g.sourcemaps.write())
		.pipe(g.rename(project + '.css'))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('compress', ['compile'], function() {
	return gulp.src(paths.dist + '/' + project + '.css')
		.pipe(g.minifyCss())
		.pipe(g.rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('docs', ['docs_template', 'docs_clean'], function(done) {
	shell('kss-node --config ' + paths.kssConf, function(error, stdout, stderr) {
		if (error !== null) console.log('' + error);
		else console.log(stdout);
		done();
	});
});

gulp.task('docs_template', function() {
	return gulp.src(kssConf.template + '/public/kss.less')
		.pipe(g.less())
		.pipe(g.cssPurge())
		.pipe(g.autoprefixer('last 2 versions'))
		.pipe(g.minifyCss())
		.pipe(g.rename('kss.css'))
		.pipe(gulp.dest(kssConf.template + '/public'));
});

gulp.task('docs_clean', function(done) {
	del([kssConf.destination + '/**/*'], done);
});

gulp.task('docs_deploy', ['docs'], function(done) {
	var remote = 'origin';
	var branch = 'gh-pages';
	g.git.exec({args: 'subtree push --prefix ' + kssConf.destination
			+ ' ' + remote + ' ' + branch}, function(error, stdout) {
		if (error !== null) console.log('' + error);
		else console.log(stdout);
		done();
	});
});

gulp.task('watch', function() {
	gulp.watch([
		paths.src + '/**/*.less',
		paths.package
	], ['compile']);

	gulp.watch([
		kssConf.source + '/' + kssConf.mask,
		kssConf.source + '/' + kssConf.homepage,
		kssConf.template + '/**/*.{html,txt,less,js}',
		paths.kssConf
	], ['docs']);
});



var fn = {
	dump: function(variable) {
		console.log(util.inspect(variable, {showHidden: false, depth: null}));
	},
	dig: function(obj, paths) {
		for(var i = 0; i < paths.length; i++) {
			obj = obj[paths[i]] = obj[paths[i]] || {};
		}
		return obj;
	}
};

gulp.task('dss', function(done) {
	//return gulp.src('src/*.less')
	return gulp.src('src/test.less')
		.pipe(g.concat('tmp.less'))
		.pipe(g.intercept(function(file) {
			var dss = require('dss');
			
			dss.parser('namespace', function(i, line, block, file){
				return line.split('.');
			});
			
			dss.parse(file.contents.toString(), {}, function(data) {
				var root = {} // The root section
				
				var subsection = function(section, paths) {
					for (var i = 0; i < paths.length; i++) {
						var item = paths[i];
						var iSection = null;
						if (!section.section) section.section = [];
						else {
							for (var j = 0; j < section.section.length; j++) {
								var jtem = section.section[j];
								if (jtem.name != item) continue;
								iSection = jtem;
								break;
							}
						}
						if (!iSection) {
							iSection = {name: item};
							section.section.push(iSection);
						}
						section = iSection;
					}
					return section;
				};
				
				data.blocks.forEach(function(item, i) {
					var iNS = item.namespace.concat(); // Clone array
					iNS.push(item.name.toLowerCase()
						.replace(/^[^a-z0-9_-]+/, '') // Trim leading symbols
						.replace(/[^a-z0-9_-]/, '-')); // Replace symbols with a hyphen
					var iSection = subsection(root, iNS);
					iSection.data = item; // Store raw data
				});
				
				var plates = require('plates');
				var map = plates.Map();
				var t = {
					index: fs.readFileSync('dssdocs_template/index.html'),
					section: fs.readFileSync('dssdocs_template/section.html')
				};
				
				fn.dump(root);
				map.where('id').is('primary').append(t.section);
				
				file.contents = new Buffer(plates.bind(t.index, root, map));
			});
			return file;
		}))
		.pipe(g.rename('index.html'))
		.pipe(gulp.dest('dssdocs/'));
});

var createNex
