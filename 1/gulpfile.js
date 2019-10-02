const { watch, src, dest, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function cssTask(done) {
  src('./src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(rename({ suffix: '.bundle' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('./disc/css/'));
  done();
}

function templateTask(done) {
  src('./*.html')
    .pipe(dest('./disc/'));
  done();
}

function watchFiles() {
  watch('./src/scss/', series(cssTask, reload));
  watch('./*.html', series(templateTask, reload));
}

function liveReload(done) {
  browserSync.init({
    server: {
      baseDir: './disc/'
    },
  });
  done();
}

function reload (done) {
  browserSync.reload();
  done();
}

function cleanUp() {
  return del(['./disc/*']);
}

exports.dev = parallel( cssTask, templateTask, watchFiles, liveReload);
exports.build = series(cleanUp, parallel( cssTask, templateTask));
