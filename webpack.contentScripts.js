const {DefinePlugin} = require('webpack');
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
    any: path.join(source, './includes/any'),
    anyFrame: path.join(source, './includes/anyFrame'),
    ya: path.join(source, './includes/ya'),
    yaFrame: path.join(source, './includes/yaFrame'),
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