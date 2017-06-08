var gulp = require("gulp");
var webpack = require('webpack-stream');

gulp.task("default", function(){
	return gulp.src('./script/')
		.pipe(webpack( require('./webpack.config.ts') ))
		.pipe(gulp.dest('dist/'));
});
