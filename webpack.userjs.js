const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getDistPath = require('./builder/getDistPath');
const path = require('path');
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
      {
        from: path.join(monoPath, './browsers/userscript/meta.txt'),
        to: path.join(distPath, './meta.txt'),
        transform: (content, path) => {
          content = String(content);
          content = content.replace('{VERSION}', BUILD_ENV.version);
          return content;
        }
      },
      {from: path.join(sourcePath, './_locales'), to: path.join(distPath, './_locales')},
    ]),
    new RemoveAssets(['empty.point']),
  ],
};

module.exports = config;