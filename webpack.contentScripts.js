const {DefinePlugin} = require('webpack');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const mono = require('./builder/getMono');

const {src, dist} = require('./builder/getOutput');

const env = require('./builder/getEnv');

const config = {
  entry: {
    any: path.join(src, './includes/any'),
    anyFrame: path.join(src, './includes/anyFrame'),
    ya: path.join(src, './includes/ya'),
    yaFrame: path.join(src, './includes/yaFrame'),
  },
  output: {
    path: dist,
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
      'mono': path.join(mono, `./browsers/${browser}/contentScript`),
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