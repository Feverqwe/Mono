const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');

const isWatch = require('./isWatch');

const mode = require('./getMode');

const browser = require('./getBrowser');

const outputPath = path.resolve(`./dist/${browser}`);

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPTS} = require('./getContentScripts')(outputPath);

const env = require('./getEnv');

const config = {
  entry: {
    router: 'router',
  },
  output: {
    path: outputPath,
    filename: 'includes/[name].js'
  },
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
      'router': path.resolve(__dirname, `./vendor/mono/browsers/${browser}/router`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(outputPath, 'includes')
    ]),
    new DefinePlugin({
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;