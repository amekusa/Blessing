module.exports = function(grunt) {
	require("jit-grunt")(grunt); // Load modules Just-in-Time

	grunt.initConfig({ // Define tasks

		less: { // Compile LESS files to CSS

			dev: {
				options: {
					compress: false,
					yuicompress: false,
					optimization: 2
				},
				files: {
					"dist/blessing.css": "src/main.less" // Destination file and source file
				}
			},

			dist: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					"dist/blessing.css": "src/main.less" // Destination file and source file
				}
			}
		},

		watch: { // Run predefined tasks whenever watched files change
			styles: {
				files: ["src/**/*.less"], // Files to watch
				tasks: ["less"], // Tasks run immediately on watched files changed
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.registerTask("default", ["less", "watch"]);
	grunt.registerTask("dist", ["less:dist", "watch"]);
};
