const gulp = require('gulp');
const webpack = require('webpack');
const path = require('path');
require('./builder/defaultBuildEnv');

BUILD_ENV.babelOptions.plugins.splice(0);
BUILD_ENV.babelOptions.presets.splice(0);

const runWebpack = config => {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err);
      console.log(stats.toString(Object.assign(webpack.Stats.presetToOptions('default'), {
        colors: true,
      })));
      resolve();
    });
  });
};

const buildBase = () => {
  return runWebpack([
    require('./webpack.background'),
    require('./webpack.pages'),
    require('./webpack.contentScripts'),
  ]);
};

gulp.task('buildChrome', () => {
  const manifest = require('./src/manifest');

  BUILD_ENV.version = manifest.version;

  BUILD_ENV.babelOptions.presets.push(
    ['@babel/preset-env', {
      targets: {
        browsers: [
          'Chrome >= 40'
        ]
      }
    }]
  );

  BUILD_ENV.outputPath = path.resolve('./dist/chrome');
  BUILD_ENV.monoBrowser = 'chrome';

  return runWebpack(require('./webpack.chrome'))
    .then(() => buildBase());
});

gulp.task('buildFirefox', () => {
  const manifest = require('./src/manifest');
  const version = `${manifest.version}`;

  BUILD_ENV.geckoId = 'mono@example.example';
  BUILD_ENV.version = version;

  BUILD_ENV.babelOptions.presets.push(
    ['@babel/preset-env', {
      targets: {
        browsers: [
          'Firefox >= 48'
        ]
      }
    }]
  );

  BUILD_ENV.outputPath = path.resolve('./dist/firefox');
  BUILD_ENV.monoBrowser = 'firefox';

  return runWebpack(require('./webpack.firefox'))
    .then(() => buildBase());
});

gulp.task('buildEdge', () => {
  const manifest = require('./src/manifest');

  BUILD_ENV.version = manifest.version;

  BUILD_ENV.babelOptions.presets.push(
    ['@babel/preset-env', {
      targets: {
        browsers: [
          'Edge >= 14.14291'
        ]
      }
    }]
  );

  BUILD_ENV.outputPath = path.resolve('./dist/edge');
  BUILD_ENV.monoBrowser = 'edge';

  return runWebpack(require('./webpack.chrome'))
    .then(() => buildBase());
});

gulp.task('buildSafari', () => {
  const manifest = require('./src/manifest');

  BUILD_ENV.version = manifest.version;

  BUILD_ENV.babelOptions.presets.push(
    ['@babel/preset-env', {
      targets: {
        browsers: [
          'Safari >= 10'
        ]
      }
    }]
  );

  BUILD_ENV.outputPath = path.resolve('./dist/safari');
  BUILD_ENV.monoBrowser = 'safari';

  return runWebpack(require('./webpack.safari'))
    .then(() => buildBase())
    .then(() => runWebpack(require('./webpack.router')));
});

gulp.task('buildUserjs', () => {
  const manifest = require('./src/manifest');

  BUILD_ENV.version = manifest.version;

  BUILD_ENV.babelOptions.presets.push(
    ['@babel/preset-env', {
      targets: {
        browsers: [
          'Chrome >= 40',
          'Safari >= 10',
          'Firefox >= 48'
        ]
      }
    }]
  );

  BUILD_ENV.outputPath = path.resolve('./dist/userjs');
  BUILD_ENV.monoBrowser = 'userscript';

  return runWebpack(require('./webpack.userjs'))
    .then(() => buildBase())
    .then(() => runWebpack(require('./webpack.bundle')));
});

gulp.task('setArgv', done => {
  BUILD_ENV.monoPath = path.resolve('./mono');
  BUILD_ENV.sourcePath = path.resolve('./src');
  BUILD_ENV.devtool = 'source-map';
  BUILD_ENV.mode = process.env.RELEASE ? 'production' : 'development';
  if (BUILD_ENV.mode === 'production') {
    BUILD_ENV.devtool = 'none';
  }
  done();
});

let fired = false;
gulp.task('singleTaskLock', done => {
  if (fired) throw new Error("Another task is already running");
  fired = true;
  done();
});

gulp.task('userjs', gulp.series('singleTaskLock', 'setArgv', 'buildUserjs'));

gulp.task('safari', gulp.series('singleTaskLock', 'setArgv', 'buildSafari'));

gulp.task('chrome', gulp.series('singleTaskLock', 'setArgv', 'buildChrome'));

gulp.task('firefox', gulp.series('singleTaskLock', 'setArgv', 'buildFirefox'));

gulp.task('edge', gulp.series('singleTaskLock', 'setArgv', 'buildEdge'));
