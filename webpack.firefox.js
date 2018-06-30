const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const getDistPath = require('./builder/getDistPath');
const RemoveAssets = require('./builder/removeAssets');

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
      {
        from: path.join(sourcePath, './manifest.json'),
        to: path.join(distPath, './manifest.json'),
        transform: (content, path) => {
          const manifest = JSON.parse(content);

          manifest.version = BUILD_ENV.version;

          manifest.applications = {
            gecko: {
              id: BUILD_ENV.geckoId,
              strict_min_version: '48.0'
            }
          };

          manifest.options_ui = {};
          manifest.options_ui.page = manifest.options_page;
          manifest.options_ui.open_in_tab = true;

          delete manifest.options_page;

          delete manifest.background.persistent;

          delete manifest.update_url;
          delete manifest.minimum_chrome_version;

          return JSON.stringify(manifest, null, 4);
        }
      },
      {from: path.join(sourcePath, './icons'), to: path.join(distPath, './icons')},
      {from: path.join(sourcePath, './_locales'), to: path.join(distPath, './_locales')},
    ]),
    new RemoveAssets(['empty.point']),
  ],
};

module.exports = config;