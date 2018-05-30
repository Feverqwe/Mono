const {DefinePlugin} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const mono = require('./builder/getMono');

const {src, dist} = require('./builder/getOutput');

const env = require('./builder/getEnv');

const config = {
  entry: {
    popup: path.join(src, './js/popup'),
    options: path.join(src, './js/options'),
  },
  output: {
    path: dist,
    filename: 'js/[name].js'
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
      'mono': path.join(mono, `./browsers/${browser}/page`),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: path.join(src, './popup.html'),
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: path.join(src, './options.html'),
      chunks: ['options']
    }),
    new DefinePlugin({
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

if (browser === 'safari') {
  const LOCALE_MAP = require('./builder/getLocaleMap');

  config.plugins.push(
    new DefinePlugin({
      'LOCALE_MAP': JSON.stringify(LOCALE_MAP),
    })
  );
}

module.exports = config;