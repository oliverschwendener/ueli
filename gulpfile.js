const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const clean = require('gulp-clean');

const sourceFiles = {
    sass: 'src/css/**/*.scss',
    js: 'src/js/**/*.js'
};

const jsDestFolder = './js';
const sassDestFolder = './css';

gulp.task('clean', () => {
    return gulp
        .src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('js', () => {
    return gulp.src(sourceFiles.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(jsDestFolder));
});

gulp.task('sass', () => {
    return gulp
        .src(sourceFiles.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest(sassDestFolder));
});

gulp.task('build', ['clean', 'js', 'sass']);

gulp.task('watch', ['js', 'sass'], () => {
    gulp.watch(sourceFiles.sass, ['sass']);
    gulp.watch(sourceFiles.js, ['js']);
});

gulp.task('default', ['watch']);