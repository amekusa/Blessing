var project = require('package.json').name.toLowerCase();

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();

gulp.task("default", ["build", "watch"]);

gulp.task("build", ["compile", "compress"]);

gulp.task("compile", ["bundle"], function() {
	return gulp.src("src/" + project + ".less")
			.pipe(plugins.less({
				
			}))
			.pipe(plugins.rename({extname: ".css"}))
			.pipe(gulp.dest("dist"))
			.pipe(plugins.notify("Less Compile succeeded!"));
});

gulp.task("bundle", function() {
	return gulp.src("src/main.less")
			.pipe(plugins.bundle-assets())
			.pipe(gulp.dest("dist"))
});

gulp.task("compress", ["compile"], function() {
	return gulp.src("src/style.css")
			.pipe(plugins.cssimport())
			.pipe(plugins.autoprefixer("last 2 versions"))
			.pipe(plugins.minifyCss())
			.pipe(plugins.rename({extname: ".min.css"}))
			.pipe(gulp.dest("dist"));
});

gulp.task("watch", function() {
	browserSync.init
		
	gulp.watch(["src/*.less"], ["lessc"]);
});
