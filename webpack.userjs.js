const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = require('./isWatch');

const mode = require('./getMode');

const outputPath = path.resolve(`./dist/userscript`);

const config = {
  entry: {
    empty: 'noop2',
  },
  output: {
    path: outputPath,
    filename: '../userjs.entry'
  },
  plugins: [
    new CleanWebpackPlugin([
      outputPath,
      path.join(outputPath, '../userjs.entry')
    ]),
    new CopyWebpackPlugin([
      {from: './src/icons', to: './icons'},
    ]),
  ],
};

module.exports = config;