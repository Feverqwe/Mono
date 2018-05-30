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
    background: path.join(source, 'js/background'),
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
      'mono': path.join(mono, `./browsers/${browser}/backgroundPage`),
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

if (browser === 'safari') {
  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'background.html',
      template: path.join(source, './background.html'),
      chunks: ['background']
    })
  );
}

module.exports = config;