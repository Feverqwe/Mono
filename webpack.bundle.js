const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const source = require('./builder/getSource');

const output = require('./builder/getOutput');

const LOCALE_MAP = require('./builder/getLocaleMap');

const BACKGROUND_SCRIPTS = require('./builder/getBackgroundScripts');

const OPTIONS_SCRIPTS = require('./builder/getOptionsScripts');

const POPUP_SCRIPTS = require('./builder/getPopupScripts');

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPTS} = require('./builder/getContentScripts');

const env = require('./builder/getEnv');

const config = {
  entry: {
    bundle: 'bundle',
  },
  output: {
    path: output,
    filename: '[name].js'
  },
  mode: mode,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', env]
            ]
          }
        }
      },
    ]
  },
  resolve: {
    alias: {
      'bundle': path.join(source, `./vendor/mono/browsers/${browser}/bundle`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(output, 'includes'),
      path.join(output, 'js'),
      path.join(output, '_locales'),
      path.join(output, 'options.html'),
      path.join(output, 'popup.html'),
    ]),
    new DefinePlugin({
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      BACKGROUND_SCRIPTS: JSON.stringify(BACKGROUND_SCRIPTS),
      OPTIONS_SCRIPTS: JSON.stringify(OPTIONS_SCRIPTS),
      POPUP_SCRIPTS: JSON.stringify(POPUP_SCRIPTS),
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;