var gulp  = require('gulp');

var copy = require('gulp-copy')
	,browserify = require('browserify')
	,buffer = require('vinyl-buffer')
	,gulpCssNano = require('gulp-cssnano')
	,gulpIf = require('gulp-if')
	,gulpLess = require('gulp-less')
	,gulpUglify = require('gulp-uglify')
	,reactify = require('reactify')
	,source = require("vinyl-source-stream");

var argv = require('yargs').argv
	,statics = ['index.html', 'background.js', 'manifest.json', 'images/*', 'fonts/*'];

gulp.task('statics', function(){
	return gulp.src(statics)
		.pipe(copy('build'));
});

gulp.task('style', function(){
	if(!argv.prod) gulp.watch(['less/**'], ['style']);

	return gulp.src('less/app.less')
		.pipe(gulpLess())
		.pipe(gulpCssNano())
		.pipe(gulp.dest('build/css'));
});

gulp.task('browserify', function(){
	if(!argv.prod) gulp.watch(['js/**', 'config/**'], ['browserify', 'browserify-content-script']);
	if(!argv.prod) gulp.watch(statics, ['init']);

	return browserify({debug: !argv.prod})
		.transform(reactify)
		.add('js/app.jsx')
		.bundle()
		.pipe(source("app.js"))
		.pipe(buffer())
		.pipe(gulpIf(argv.prod, gulpUglify()))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('browserify-content-script', function () {
	return browserify({debug: !argv.prod})
		.add('js/content-script/index.js')
		.bundle()
		.pipe(source('content-script.js'))
		.pipe(buffer())
		.pipe(gulpIf(argv.prod, gulpUglify()))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('init', ['statics']);

gulp.task('build', ['browserify', 'browserify-content-script', 'style']);