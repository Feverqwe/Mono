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
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
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
  process.argv.push('--source-path', path.resolve('./src'));
  process.argv.push('--output-path', path.resolve('./dist/userjs'));
  process.argv.push('--mono-browser', 'userscript');
  process.argv.push('--mode', 'development');
  return runWebpack(require('./webpack.userjs'));
});

gulp.task('buildSafari', () => {
  process.argv.push('--source-path', path.resolve('./src'));
  process.argv.push('--output-path', path.resolve('./dist/safari'));
  process.argv.push('--mono-browser', 'safari');
  process.argv.push('--mode', 'development');
  return runWebpack(require('./webpack.safari'));
});

gulp.task('buildChrome', () => {
  process.argv.push('--source-path', path.resolve('./src'));
  process.argv.push('--output-path', path.resolve('./dist/chrome'));
  process.argv.push('--mono-browser', 'chrome');
  process.argv.push('--mode', 'development');
  return runWebpack(require('./webpack.chrome'));
});

gulp.task('userjs', callback => {
  runSequence('buildUserjs', 'buildBase', 'buildBundle', callback);
});

gulp.task('safari', callback => {
  runSequence('buildSafari', 'buildBase', 'buildRouter', callback);
});

gulp.task('chrome', callback => {
  runSequence('buildChrome', 'buildBase', callback);
});