const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const path = require('path');
const runSequence = require('run-sequence');

const runWebpack = config => {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err);
      gutil.log(stats.toString({
        colors: gutil.colors.supportsColor,
      }));
      resolve();
    });
  });
};

gulp.task('buildBase', () => {
  return runWebpack([
    require('./webpack.background'),
    require('./webpack.pages'),
    require('./webpack.contentScripts'),
  ]);
});

gulp.task('buildBundle', () => {
  return runWebpack(require('./webpack.bundle'));
});

gulp.task('buildRouter', () => {
  return runWebpack(require('./webpack.router'));
});

gulp.task('buildUserjs', () => {
  process.argv.push('--output-path', path.resolve('./dist/userjs'));
  process.argv.push('--mono-browser', 'userscript');
  return runWebpack(require('./webpack.userjs'));
});

gulp.task('buildSafari', () => {
  process.argv.push('--output-path', path.resolve('./dist/safari.safariextension'));
  process.argv.push('--mono-browser', 'safari');
  return runWebpack(require('./webpack.safari'));
});

gulp.task('buildChrome', () => {
  process.argv.push('--output-path', path.resolve('./dist/chrome'));
  process.argv.push('--mono-browser', 'chrome');
  return runWebpack(require('./webpack.chrome'));
});

gulp.task('setArgv', () => {
  process.argv.push('--source-path', path.resolve('./src'));
  // process.argv.push('--mode', 'production');
  process.argv.push('--mode', 'development');
});

let fired = false;
gulp.task('singleTaskLock', () => {
  if (fired) throw new Error("Another task is already running");
  fired = true;
});

gulp.task('userjs', callback => {
  runSequence('singleTaskLock', 'setArgv', 'buildUserjs', 'buildBase', 'buildBundle', callback);
});

gulp.task('safari', callback => {
  runSequence('singleTaskLock', 'setArgv', 'buildSafari', 'buildBase', 'buildRouter', callback);
});

gulp.task('chrome', callback => {
  runSequence('singleTaskLock', 'setArgv', 'buildChrome', 'buildBase', callback);
});