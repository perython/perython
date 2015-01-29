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
var server = require('../server');

global.isProd = false;

var dest = '../static/admin';

gulp.task('admin_index', function() {
  return gulp.src('./admin/assets/index.html')
    .pipe(gulp.dest(dest));
});

gulp.task('admin_styles', function() {
  return gulp.src('./admin/assets/styles/app.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe(gulpif(global.isProd, minifyCSS({keepSpecialComments: 0})))
    .pipe($.rename('app.css'))
    .pipe(gulp.dest(dest + '/styles'))
    .pipe(reload({ stream: true }));
});

gulp.task('admin_images', function() {
  return gulp.src('./admin/assets/images/**/*.*')
    .pipe(gulpif(global.isProd, $.imagemin({progressive:true})))
    .pipe(gulp.dest(dest + '/images'));
});

gulp.task('admin_fonts', function() {
  return gulp.src(['./admin/node_modules/font-awesome/fonts/**/*.*'])
    .pipe(gulp.dest(dest + '/fonts'));
});

var bundler = _.memoize(function(watch) {
  var options = {debug: true};

  if (watch) {
    _.extend(options, watchify.args);
  }

  var b = browserify('./admin/app/app.js', options)
    .transform('babelify', {presets: ['es2015']});

  if (watch) {
    b = watchify(b);
  }

  return b;
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  delete args[0]['stream'];
  $.util.log(args);
  this.emit('end');
}

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

gulp.task('admin_scripts', function(cb) {
  process.env.BROWSERIFYSWAP_ENV = dest;
  bundle(cb, !global.isProd);
});

gulp.task('admin_build', [
  'admin_index',
  'admin_images',
  'admin_styles',
  'admin_fonts',
  'admin_scripts'
]);

gulp.task('admin_watch', ['admin_build'], function() {
  browserSync({
    server: {
      baseDir: dest,
      middleware: function(req, res, next) {
        server(req, res, next);
      }
    }
  });

  bundler(true).on('update', function() {
    gulp.start('admin_scripts');
  });
  gulp.watch(['./admin/assets/index.html'], ['admin_index']);
  gulp.watch(['./admin/assets/styles/**/*.less'], ['admin_styles']);
});

gulp.task('admin_set_config', function() {
  if (global.isProd) {
    gulp.src('./configs/production.js')
      .pipe(gulprename('config.js'))
      .pipe(gulp.dest('./admin/app'));
  } else {
    gulp.src(process.env.PERYTHON_FRONT_SETTINGS)
      .pipe(gulprename('config.js'))
      .pipe(gulp.dest('./admin/app'));
  }
});

gulp.task('admin_set_prod', function() {
  global.isProd = true;
});

gulp.task('admin_dev', ['admin_set_config', 'admin_watch']);

gulp.task('admin_prod', ['admin_set_prod', 'admin_set_config', 'admin_build']);
