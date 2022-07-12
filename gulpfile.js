// Importing gulp API functions
const { src, dest, watch, series, parallel } = require("gulp");
const sourcemaps = require('gulp-sourcemaps');
// CSS related packages
const sass = require('gulp-sass')(require('node-sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// JS related packages
const jquery = require('jquery');
const popper = require('@popperjs/core');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// Path to files
const files = {
    fileDest: 'assets/dist/',
    scssPath: 'assets/css/main.scss',
    jsPath: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/@popperjs/core/dist/umd/popper.js',
        'assets/js/main.js'
    ],
    cssWatch: 'assets/css/**/*.scss',
    jsWatch: 'assets/js/**/*.js'
}
// CSS: Creates sourcemap, compiles sass, lints and minifies it
function cssTask(cb) {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(files.fileDest));
    cb();
}
function cssTaskFull(cb) {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(files.fileDest));
    cb();
}
// Combines all JS files and minifies it
function jsTask(cb) {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(files.fileDest))
    cb();
}
function jsTaskFull(cb) {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(files.fileDest))
    cb();
}
// Watch Tasks
function watchTask(){
    watch(
        [files.cssWatch, files.jsWatch],
        {interval: 1000, usePolling: true},
        series(
            parallel(cssTask, jsTask)
        )
    );
}
function watchCss(){
    watch(
        files.cssWatch,
        {interval: 1000, usePolling: true},
        series(
            parallel(cssTask)
        )
    );
}
function watchJs(){
    watch(
        files.jsPath,
        {interval: 1000, usePolling: true},
        series(
            parallel(jsTask)
        )
    );
}
function buildTaskFull(cb){
    series(
        parallel(cssTaskFull, jsTaskFull)
    );
    cb();
}
exports.css = cssTask;
exports.cssFull = cssTaskFull;
exports.js = jsTask;
exports.jsFull = jsTaskFull;
exports.watch = watchTask;
exports.watchCss = watchCss;
exports.watchJs = watchJs;
exports.buildFull = buildTaskFull;