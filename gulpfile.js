var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');

var testFiles = [
  './test/*spec.js'
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
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('test', ['lint', 'runTests']);

gulp.task('default', ['lint', 'watch']);
