var del = require('del');
var concat = require('gulp-concat');
var environments = require('gulp-environments');
var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var development = environments.development;
var production = environments.production;

var paths = {
    indexHtml: 'public/index.html',
    src: ['public/src/**/*.js', '!public/src/dummy.js'],
    template: 'public/src/**/*.html',
    fonts: 'public/fonts/**/*',
    css: ['public/css/**/*.css', '!public/css/**/*.min.css'],
    csslib: 'public/css/**/*.min.css',
    lib: 'public/lib/**/*',
    config: 'public/config/**/*'
};
var targetJsFile = "events.min.js";
var targetCssFile = "events.min.css";

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('template', ['clean'], function() {
    return gulp.src(paths.template)
        .pipe(gulp.dest('build/src'));
});

gulp.task('src', ['template'], function() {
    return gulp.src(paths.src)
        .pipe(development(sourcemaps.init()))
        .pipe(uglify())
        .pipe(concat(targetJsFile))
        .pipe(development(sourcemaps.write('.')))
        .pipe(gulp.dest('build/src'));
});

gulp.task('fonts', ['clean'], function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('lib', ['clean'], function() {
    return gulp.src(paths.lib)
        .pipe(gulp.dest('build/lib'));
});

gulp.task('csslib', ['clean'], function() {
    return gulp.src(paths.csslib)
        .pipe(gulp.dest('build/css'));
});

gulp.task('css', ['clean', 'csslib'], function() {
    return gulp.src(paths.css)
        .pipe(development(sourcemaps.init()))
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(concat(targetCssFile))
        .pipe((sourcemaps.write('.')))
        .pipe(gulp.dest('build/css'));
});

gulp.task('config', ['clean'], function() {
    return gulp.src(paths.config)
        .pipe(gulp.dest('build/config'));
});

gulp.task('indexHtml', ['src', 'fonts', 'css', 'lib', 'config'], function() {
    return gulp.src(paths.indexHtml)
        .pipe(htmlreplace({
            'js': 'src/' + targetJsFile,
            'css': 'css/' + targetCssFile
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['indexHtml']);

gulp.task('dev', development.task);
gulp.task('pro', production.task);