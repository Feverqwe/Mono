require('./builder/defaultBuildEnv');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const getArgvValue = require('./builder/getArgvValue');
const getDistPath = require('./builder/getDistPath');
const RemoveAssets = require('./builder/removeAssets');

const isWatch = getArgvValue('--watch');

const mode = BUILD_ENV.mode;

const sourcePath = BUILD_ENV.sourcePath;

const outputPath = BUILD_ENV.outputPath;

const distPath = getDistPath();

const config = {
  entry: {
    empty: './builder/noop',
  },
  output: {
    path: outputPath,
    filename: 'empty.point'
  },
  mode: mode,
  devtool: 'none',
  plugins: [
    new CleanWebpackPlugin([
      outputPath
    ]),
    new CopyWebpackPlugin([
      {from: path.join(sourcePath, './manifest.json'), to: path.join(distPath, './manifest.json')},
      {from: path.join(sourcePath, './icons'), to: path.join(distPath, './icons')},
      {from: path.join(sourcePath, './_locales'), to: path.join(distPath, './_locales')},
    ]),
    new RemoveAssets(['empty.point']),
  ],
};

module.exports = config;