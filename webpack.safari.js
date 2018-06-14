const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const getDistPath = require('./builder/getDistPath');
const RemoveAssets = require('./builder/removeAssets');

const mode = BUILD_ENV.mode;

const monoPath = BUILD_ENV.monoPath;

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
      {from: path.join(sourcePath, './_locales'), to: path.join(distPath, './_locales')},
      {
        from: path.join(monoPath, './browsers/safari/Info.plist'),
        to: path.join(distPath, './Info.plist'),
        transform: (content, path) => {
          content = String(content).replace(/{VERSION}/g, BUILD_ENV.version);
          return content;
        }
      },
      {from: path.join(monoPath, './browsers/safari/Settings.plist'), to: path.join(distPath, './Settings.plist')},
      {from: path.join(sourcePath, './icons'), to: path.join(distPath, './icons')},
      {from: path.join(sourcePath, './icons/icon_16.png'), to: path.join(distPath, './Icon-16.png')},
      {from: path.join(sourcePath, './icons/icon_32.png'), to: path.join(distPath, './Icon-32.png')},
      {from: path.join(sourcePath, './icons/icon_48.png'), to: path.join(distPath, './Icon-48.png')},
    ]),
    new RemoveAssets(['empty.point']),
  ],
};

module.exports = config;