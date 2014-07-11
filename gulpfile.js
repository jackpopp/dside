/**

Files and destination variables

**/

var	ASSET_DIR         = './src/', // development source assets
	DEV_DEST_DIR      = './build/', // development destination assets
	PROD_DEV_DEST_DIR = './build/', // production assets
	MAIN_JS           = 'main.js'; // compiled js filename

/**

Gulp variables

**/

var gulp         = require('gulp'),
	watch        = require('gulp-watch'),
    coffee       = require('gulp-coffee'),
    uglify       = require('gulp-uglify'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    browserify   = require('gulp-browserify'),
    merge        = require('merge-stream'),
    notify       = require('gulp-notify');

// Javascript/Coffeescript
gulp.task('js', function(cb){
	// compile
	compile = gulp.src(ASSET_DIR+'/**/*.coffee')
		.pipe(coffee({bare: true}))
		.pipe(gulp.dest(DEV_DEST_DIR));

	copy = gulp.src([ASSET_DIR+'js/**/*.*', '!'+ASSET_DIR+'js/**/*.coffee'])
		.pipe(gulp.dest(DEV_DEST_DIR));

	return merge(compile, copy);
});


// Javascript Opitimisation and Browserify
gulp.task('jsProd', ['js'], function(){
	return gulp.src(DEV_DEST_DIR+'/js/'+MAIN_JS)
		.pipe(browserify())
		.pipe(uglify())
		.pipe(gulp.dest(PROD_DEV_DEST_DIR+'/js'));
});


// Clean dev guideline
gulp.task('clean', function(cb) {
	return gulp.src([DEV_DEST_DIR], {read: false})
    	.pipe(clean());
});

// development
// compile and copy.

gulp.task('watch', ['clean'], function() {
  // place code for your default task here
  watch({ glob: ASSET_DIR+'*.*'}, ['js']).pipe(notify({message: 'File changes compiled'}));
});


gulp.task('docs', function(){

});

// production
// compile, minify, optimize

gulp.task('build', ['jsProd'], function(){
	// clean up here
	return gulp.src([DEV_DEST_DIR], {read: false})
    	//.pipe(clean());
});