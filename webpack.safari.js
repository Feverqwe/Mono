const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const source = require('./builder/getSource');

const mono = require('./builder/getMono');

const {output, src, dist} = require('./builder/getOutput');

const config = {
  entry: {
    empty: './builder/noop',
  },
  output: {
    path: output,
    filename: 'safari.entry'
  },
  mode: mode,
  plugins: [
    new CleanWebpackPlugin([
      output
    ]),
    new CopyWebpackPlugin([
      {from: source, to: src},
      {from: path.join(mono, './browsers/safari/Info.plist'), to: path.join(dist, './Info.plist')},
      {from: path.join(mono, './browsers/safari/Settings.plist'), to: path.join(dist, './Settings.plist')},
      {from: path.join(source, './icons'), to: path.join(dist, './icons')},
      {from: path.join(source, './icons/icon_16.png'), to: path.join(dist, './Icon-16.png')},
      {from: path.join(source, './icons/icon_32.png'), to: path.join(dist, './Icon-32.png')},
      {from: path.join(source, './icons/icon_48.png'), to: path.join(dist, './Icon-48.png')},
    ]),
  ],
};

module.exports = config;