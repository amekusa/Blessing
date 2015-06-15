var project = require('./package.json').name.toLowerCase();

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var purge = require("gulp-css-purge"); // gulp-load-plugins cannot load this :(
var styleguide = require('sc5-styleguide');

gulp.task("default", ["build", "watch"]);

gulp.task("build", ["compile", "compress"]);

//gulp.task("compile", ["bundle"], function() {
gulp.task("compile", function() {
	return gulp.src("./src/main.less")
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.less({
				sourceMap: true
			}))
			.pipe(purge())
			.pipe(plugins.autoprefixer("last 2 versions"))
			.pipe(plugins.sourcemaps.write())
			.pipe(plugins.rename(project + ".css"))
			.pipe(gulp.dest("dist"));
});

gulp.task("bundle", function() {
	return gulp.src("./src/main.less")
			.pipe(plugins.bundle-assets())
			.pipe(gulp.dest("dist"));
});

gulp.task("compress", ["compile"], function() {
	return gulp.src("./dist/" + project + ".css")
			.pipe(plugins.minifyCss())
			.pipe(plugins.rename({extname: ".min.css"}))
			.pipe(gulp.dest("dist"));
});

gulp.task("docs", ["compile"], function() {
	plugins.run('kss-node --config kss-config.json').exec();
});

gulp.task("watch", function() {
	//browserSync.init
	gulp.watch(["src/*.less"], ["compile"]);
});
