var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var pug = require('gulp-pug');

var JS_SOURCE = 'src/scripts';
var JS_DEST = 'dist/scripts';
var JS_OUTPUT_FILE = 'main.js';
var CSS_SOURCE = 'src/styles';
var CSS_DEST = 'dist/styles';
var JADE_SOURCE = 'src/jade';
var JADE_DEST = 'dist';
var SERVER_BASE_DIR = './dist';
var WATCH_FILE_EXTENSIONS = ['dist/*.html'];

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: SERVER_BASE_DIR
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('pug',function() {
 gulp.src(JADE_SOURCE + '/**/*.jade')
    .pipe(plumber({
        errorHandler: function(error) {
            console.log(error.message);
            generator.emit('end');
    }}))
    .pipe(pug({
        doctype: 'html',
        pretty: false
    }))
    .pipe(gulp.dest('./dist/'));
    });

gulp.task('scripts', function() {
  return gulp.src(JS_SOURCE + '/**/*.js')
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        generator.emit('end');
    }}))
    .pipe(concat(JS_OUTPUT_FILE))
    .pipe(babel())
    .pipe(gulp.dest(JS_DEST + '/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(JS_DEST + '/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('styles', function() {
  gulp.src(CSS_SOURCE + '/**/*.scss')
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        generator.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(CSS_DEST + '/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(CSS_DEST + '/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function() {
  gulp.watch(JS_SOURCE + '/**/*.js', ['scripts']);
  gulp.watch(CSS_SOURCE + '/**/*.scss', ['styles']);
  gulp.watch(JADE_SOURCE + '/**/*.jade', ['pug']);
  gulp.watch(WATCH_FILE_EXTENSIONS, ['bs-reload']);
});
