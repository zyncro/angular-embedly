var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var connect = require('connect');
var serveStatic = require('serve-static');
var bump = require('gulp-bump');

var testFiles = [
  './test/*spec.js'
];

var watchFiles = [
  './test/*spec.js',
  './src/*.js'
];

gulp.task('runTests', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('lint', function() {
  gulp.src('./src/*.js')
    .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.start('test');
  gulp.watch(watchFiles, function() {
    gulp.start('test');
  });
});

gulp.task('test', ['lint', 'runTests']);

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