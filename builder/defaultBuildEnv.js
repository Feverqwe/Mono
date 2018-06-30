const fs = require('fs-extra');
const path = require('path');
const getArgvValue = require('./getArgvValue');

const monoPathArg = getArgvValue('--mono-path');
const sourcePathArg = getArgvValue('--source-path');
const outputPathArg = getArgvValue('--1output-path');

global.BUILD_ENV = global.BUILD_ENV || {
  monoPath: monoPathArg === null ? '' : path.resolve(monoPathArg),
  monoBrowser: getArgvValue('--mono-browser'),
  sourcePath: sourcePathArg === null ? '' : path.resolve(sourcePathArg),
  outputPath: outputPathArg === null ? '' : path.resolve(outputPathArg),
  devtool: 'source-map',
  mode: getArgvValue('--mode'),
  version: sourcePathArg === null ? '' : fs.readJsonSync(path.join(path.resolve(sourcePathArg), 'manifest.json')).version,
  geckoId: null,
  babelOptions: {
    presets: [
      ['env', {
        targets: {
          browsers: [
            'Chrome >= 65']
        }
      }]
    ],
    plugins: []
  },
};