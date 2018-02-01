const gulp = require('gulp')
const sass = require('gulp-sass')

const sourceFiles = {
    scss: './src/styles/scss/**/*.scss',
}

const outputFolders = {
    css: './src/styles/css',
}

gulp.task('styles', () => {
    return gulp
        .src(sourceFiles.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(outputFolders.css))
})

gulp.task('build', ['styles'])

gulp.task('watch', ['build'], () => {
    gulp.watch(sourceFiles.scss, ['styles'])
})

gulp.task('default', ['watch'])