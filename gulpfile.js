'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var filesToWatch = [
    './assets/scss/**/*.scss'
];

var sassFileToCompile = './assets/scss/app.scss';
var sassDestFolder = './css';

gulp.task('sass', function(){
    return gulp
        .src(sassFileToCompile)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest(sassDestFolder));
});

gulp.task('watch', ['sass'], function(){
    gulp.watch(filesToWatch, ['sass'])
});