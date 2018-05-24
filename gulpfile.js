const gulp = require('gulp');
const gutil = require('gulp-util');

let browser = null;
process.argv.some((arg, index) => {
  if (arg === '--mono-browser') {
    browser = process.argv[index + 1];
    return true;
  }
});

gulp.task('buildRouter', function (callback) {
  console.log('hi!', browser);
  callback();
});