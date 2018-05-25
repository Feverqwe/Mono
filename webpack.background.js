const {DefinePlugin} = require('webpack');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const output = require('./builder/getOutput');

const env = require('./builder/getEnv');

const config = {
  entry: {
    background: './src/js/background',
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
      'mono': path.resolve(__dirname, `./vendor/mono/browsers/${browser}/backgroundPage`),
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

module.exports = config;