var gulp = require('gulp');
var gulpif = require('gulp-if');
var gulprename = require('gulp-rename');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var minifyCSS = require('gulp-minify-css');

global.isProd = false;

var dest = '../static/landing';

gulp.task('landing_styles', function() {
  return gulp.src('./landing/app/styles/app.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe(gulpif(global.isProd, minifyCSS({keepSpecialComments: 0})))
    .pipe($.rename('app.css'))
    .pipe(gulp.dest(dest + '/styles'))
    .pipe(reload({ stream: true }));
});

gulp.task('landing_fonts', function() {
  return gulp.src(['./landing/node_modules/font-awesome/fonts/**/*.*'])
    .pipe(gulp.dest(dest + '/fonts'));
});

gulp.task('landing_assets', function() {
  return gulp.src('./landing/assets/**/*.*')
    .pipe(gulp.dest(dest + '/..'));
});

var bundler = _.memoize(function(watch) {
  var options = {debug: true};

  if (watch) {
    _.extend(options, watchify.args);
  }

  var b = browserify('./landing/app/app.js', options)
    .transform('babelify', {presets: ['es2015']});

  if (watch) {
    b = watchify(b);
  }

  return b;
});

var handleErrors = function() {
  var args = Array.prototype.slice.call(arguments);
  delete args[0]['stream'];
  $.util.log(args);
  this.emit('end');
};

function bundle(cb, watch) {
  return bundler(watch).bundle()
    .on('error', handleErrors)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(global.isProd, $.uglify()))
    .pipe(gulpif(!global.isProd, $.sourcemaps.init({ loadMaps: true })))
    .pipe(gulpif(!global.isProd, $.sourcemaps.write('./')))
    .pipe(gulp.dest(dest))
    .on('end', cb)
    .pipe(reload({ stream: true }));
}

gulp.task('landing_scripts', function(cb) {
  process.env.BROWSERIFYSWAP_ENV = dest;
  bundle(cb, !global.isProd);
});

gulp.task('landing_revision', function() {
  if (global.isProd) {
    return gulp.src(dest + '/index.html')
      .pipe($.staticHash({asset: dest + '/../..'}))
      .pipe(gulp.dest(dest));
  }
});

gulp.task('landing_build', [
  'landing_styles',
  'landing_fonts',
  'landing_assets',
  'landing_scripts'
]);

gulp.task('landing_watch', ['landing_build'], function() {
  var server = require('../server');
  browserSync({
    server: {
      baseDir: dest,
      middleware: function(req, res, next) {
        server(req, res, next);
      }
    }
  });

  bundler(true).on('update', function () {
    gulp.start('landing_scripts');
  });

  gulp.watch(['./landing/app/styles/**/*.less'], ['landing_styles']);
  gulp.watch(['./landing/assets/**/*.*'], ['landing_assets']);
});

gulp.task('landing_set_config', function() {
  if (global.isProd) {
    gulp.src('./configs/production.js')
      .pipe(gulprename('config.js'))
      .pipe(gulp.dest('./landing/app'));
  } else {
    gulp.src(process.env.PERYTHON_FRONT_SETTINGS)
      .pipe(gulprename('config.js'))
      .pipe(gulp.dest('./landing/app'));
  }
});

gulp.task('landing_set_prod', function() {
  global.isProd = true;
});

gulp.task('landing_dev', ['landing_set_config', 'landing_watch']);

gulp.task('landing_prod', ['landing_set_prod', 'landing_set_config', 'landing_build'], function() {
  gulp.start('landing_revision');
});
