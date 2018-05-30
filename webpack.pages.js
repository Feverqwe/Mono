const {DefinePlugin} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const source = require('./builder/getSource');

const mono = require('./builder/getMono');

const output = require('./builder/getOutput');

const env = require('./builder/getEnv');

const config = {
  entry: {
    popup: path.join(source, './js/popup'),
    options: path.join(source, './js/options'),
  },
  output: {
    path: output,
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
      template: path.join(source, './popup.html'),
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: path.join(source, './options.html'),
      chunks: ['options']
    }),
    new DefinePlugin({
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;