const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const source = require('./builder/getSource');

const output = require('./builder/getOutput');

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPTS} = require('./builder/getContentScripts')(output);

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
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;