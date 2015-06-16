var paths = {
	package: './package.json',
	kssConf: './kss-config.json',
	src: './src',
	dist: './dist',
	docs: './docs'
};

var package = require(paths.package);
var project = package.name.toLowerCase();
var kssConf = require(paths.kssConf);

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['compile', 'compress']);

gulp.task('compile', function() {
	return gulp.src(paths.src + '/main.less')
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.less({
			sourceMap: true
		}))
		.pipe(plugins.cssPurge())
		.pipe(plugins.autoprefixer('last 2 versions'))
		.pipe(plugins.sourcemaps.write())
		.pipe(plugins.rename(project + '.css'))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('compress', ['compile'], function() {
	return gulp.src(paths.dist + '/' + project + '.css')
		.pipe(plugins.minifyCss())
		.pipe(plugins.rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('docs', ['compile'], function() {
	plugins.run('kss-node --config ' + paths.kssConf).exec();
});

gulp.task('watch', function() {
	gulp.watch([
		paths.src + '/**/*.less',
		paths.package
	], ['compile']);

	gulp.watch([
		kssConf.source + '/' + kssConf.mask,
		kssConf.source + '/' + kssConf.homepage,
		paths.kssConf
	], ['docs']);
});
