var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('style', function() {
	return gulp.src('src/style.css')
			.pipe(cssimport())
			.pipe(autoprefixer('last 2 versions'))
			.pipe(minifyCss())
			.pipe(rename({extname: '.min.css'}))
			.pipe(gulp.dest('dist/'));
});