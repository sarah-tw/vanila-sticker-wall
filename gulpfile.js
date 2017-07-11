'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');


gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());;
});

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('compilejs', function() {
  return gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/tmp/'))
    .pipe(webpack({
      output: {
        filename: 'main.js',
      },
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(connect.reload());;
});

gulp.task('watch', function () {
  gulp.watch('./*.html', ['html']);
  gulp.watch('./src/sass/*.scss', ['sass']);
  gulp.watch('./src/js/*.js', ['compilejs']);
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    port: 3001,
    livereload: true
  });
});



gulp.task('default', ['connect', 'sass', 'compilejs', 'watch']);