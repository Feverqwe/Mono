const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const source = require('./builder/getSource');

const {output, src} = require('./builder/getOutput');

const config = {
  entry: {
    empty: './builder/noop',
  },
  output: {
    path: output,
    filename: 'userjs.entry'
  },
  mode: mode,
  devtool: 'none',
  plugins: [
    new CleanWebpackPlugin([
      output
    ]),
    new CopyWebpackPlugin([
      {from: source, to: src},
    ]),
  ],
};

module.exports = config;