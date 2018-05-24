const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const isWatch = process.argv.some(function (arg) {
  return arg === '--watch';
});

let mode = null;
process.argv.some((arg, index) => {
  if (arg === '--mode') {
    mode = process.argv[index + 1];
    return true;
  }
});

const outputPath = path.resolve(`./dist/chrome`);

const config = {
  entry: {
    empty: 'noop2',
  },
  output: {
    path: outputPath,
    filename: '../chrome.entry'
  },
  plugins: [
    new CleanWebpackPlugin([
      outputPath,
      path.join(outputPath, '../chrome.entry')
    ]),
    new CopyWebpackPlugin([
      {from: './src/manifest.json'},
      {from: './src/icons', to: './icons'},
      {from: './src/_locales', to: './_locales'},
    ]),
  ],
};

module.exports = config;