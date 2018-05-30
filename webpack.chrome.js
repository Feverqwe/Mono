const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const source = require('./builder/getSource');

const {output, src, dist} = require('./builder/getOutput');

const config = {
  entry: {
    empty: './builder/noop',
  },
  output: {
    path: output,
    filename: 'chrome.entry'
  },
  mode: mode,
  plugins: [
    new CleanWebpackPlugin([
      output
    ]),
    new CopyWebpackPlugin([
      {from: path.join(source, './manifest.json'), to: path.join(dist, './manifest.json')},
      {from: path.join(source, './icons'), to: path.join(dist, './icons')},
      {from: path.join(source, './_locales'), to: path.join(dist, './_locales')},
    ])
  ],
};

if (!isWatch) {
  config.plugins.unshift(
    new CopyWebpackPlugin([
      {from: source, to: src}
    ])
  );
}

module.exports = config;