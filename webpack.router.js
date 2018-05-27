const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const source = require('./builder/getSource');

const output = require('./builder/getOutput');

const LOCALE_MAP = require('./builder/getLocaleMap');

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPT_INDEX, CONTENT_SCRIPTS} = require('./builder/getContentScripts');

const env = require('./builder/getEnv');

const config = {
  entry: {
    router: 'router',
  },
  output: {
    path: output,
    filename: 'includes/[name].js'
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
      'router': path.join(source, `./vendor/mono/browsers/${browser}/router`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(output, 'includes')
    ]),
    new DefinePlugin({
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      CONTENT_SCRIPT_INDEX: JSON.stringify(CONTENT_SCRIPT_INDEX),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;