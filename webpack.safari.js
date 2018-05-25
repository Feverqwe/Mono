const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const source = require('./builder/getSource');

const output = require('./builder/getOutput');

const config = {
  entry: {
    empty: './builder/noop',
  },
  output: {
    path: output,
    filename: '../safari.entry'
  },
  mode: mode,
  plugins: [
    new CleanWebpackPlugin([
      output,
      path.join(output, '../safari.entry')
    ]),
    new CopyWebpackPlugin([
      {from: path.join(source, './icons'), to: './icons'},
    ]),
  ],
};

module.exports = config;