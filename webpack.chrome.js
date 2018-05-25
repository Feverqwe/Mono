const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const output = require('./builder/getOutput');

const config = {
  entry: {
    empty: 'noop2',
  },
  output: {
    path: output,
    filename: '../chrome.entry'
  },
  mode: mode,
  plugins: [
    new CleanWebpackPlugin([
      output,
      path.join(output, '../chrome.entry')
    ]),
    new CopyWebpackPlugin([
      {from: './src/manifest.json'},
      {from: './src/icons', to: './icons'},
      {from: './src/_locales', to: './_locales'},
    ]),
  ],
};

module.exports = config;