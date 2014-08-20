var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var connect = require('connect');
var serveStatic = require('serve-static');
var bump = require('gulp-bump');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var coveralls = require('gulp-coveralls');

var testFiles = [
  'test/*spec.js'
];

var watchFiles = [
  'test/*spec.js',
  'angular.embedly.js'
];

gulp.task('run-tests', function() {
  return gulp.src('./nonexistent')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('lint', function() {
  gulp.src(watchFiles)
    .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.start('test');
  gulp.watch(watchFiles, function() {
    gulp.start('test');
  });
});

 gulp.task('coveralls', function () {
    gulp.src('coverage/**/lcov.info')
      .pipe(coveralls());
});

gulp.task('test', ['lint', 'run-tests']);

gulp.task('default', ['watch']);

gulp.task('connect', function() {
  connect.server();
});

gulp.task('server', function() {
  var app = connect().use(serveStatic('.')).listen(8080);
});

gulp.task('bump', function(){
  gulp.src('./*.json')
  .pipe(bump({ type:'minor' }))
  .pipe(gulp.dest('./'));
});

gulp.task('minify', function () {
    gulp.src('angular.embedly.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('.'));
});
