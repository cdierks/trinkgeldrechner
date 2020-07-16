var gulp = require('gulp');
const { series } = require('gulp');
const { parallel } = require('gulp');
// Optimize image files
const imagemin = require('gulp-imagemin');
// Caching images that were already optimized
const cache = require('gulp-cache');
// Process scss files
const sass = require('gulp-sass');
// Enable Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// Enable browsersync
const browserSync = require('browser-sync').create();

// The following task is used to pipe the html files
function copyHTML() {
  return gulp.src('./source/html/*.html')
    .pipe(gulp.dest('./build'));
}

// The following task is used to pipe image files
function copyImage() {
  return gulp.src('./source/img/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('./build/design/img/'));
}

// The following task is used to pipe the javascript files
function copyJavascript() {
  return gulp.src('./source/js/*.js')
    .pipe(gulp.dest('build/design/js'));
}

// Compile SCSS to CSS
function style() {
  return gulp.src('./source/scss/main.scss')
    // outputStyle nested, expanded, compact, compressed
    .pipe(sass({ outputStyle: 'nested' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('build/design/css'))
    .pipe(browserSync.stream());
}

// Watch for new changes
function watch() {
  browserSync.init({
    server: "./build"
  });
  gulp.watch('./source/html/*.html', copyHTML);
  gulp.watch('./source/img/*', copyImage);
  gulp.watch('./source/js/*.js', copyJavascript);
  gulp.watch('./source/scss/**/*.scss', style);
  gulp.watch('./build/*.html').on('change', browserSync.reload);
}

// Copy HTML, images and Javascript from /source/ to /build/-folder
exports.init = series(copyHTML, copyImage, copyJavascript);
exports.scss = style;
exports.default = watch;