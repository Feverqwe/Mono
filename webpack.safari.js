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

const outputPath = path.resolve(`./dist/safari`);

const config = {
  entry: {
    empty: 'noop2',
  },
  output: {
    path: outputPath,
    filename: '../safari.entry'
  },
  plugins: [
    new CleanWebpackPlugin([
      outputPath,
      path.join(outputPath, '../safari.entry')
    ]),
    new CopyWebpackPlugin([
      {from: './src/icons', to: './icons'},
    ]),
  ],
};

module.exports = config;