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
