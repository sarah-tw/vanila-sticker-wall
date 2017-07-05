'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var babel = require('gulp-babel');

gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());;
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/*.scss', ['sass']);
});


gulp.task('watch', function () {
  gulp.watch(['./*.html', './src/sass/*.scss', './src/js/*.js'], ['html', 'sass', 'compile-js']);
});


gulp.task('compile-js', () => {
    return gulp.src('src/js/main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    port: 3001,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('default', ['connect', "watch"]);