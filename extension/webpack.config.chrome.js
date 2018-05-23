const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const outputPath = path.resolve('./dist/chrome');

const env = {
  targets: {
    browsers: ['Chrome >= 36']
  }
};

const config = {
  entry: {
    background: './src/js/background',
    popup: './src/js/popup',
    options: './src/js/options',
    any: './src/includes/any',
  },
  output: {
    path: outputPath,
    filename: item => {
      switch (item.chunk.name) {
        case 'any': {
          return 'includes/[name].js';
        }
        default: {
          return 'js/[name].js';
        }
      }
    }
  },
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
      'mono/backgroundPage': path.resolve(__dirname, '../src/chrome/backgroundPage'),
      'mono/popupPage': path.resolve(__dirname, '../src/chrome/popupPage'),
      'mono/optionsPage': path.resolve(__dirname, '../src/chrome/optionsPage'),
      'mono/contentScript': path.resolve(__dirname, '../src/chrome/contentScript'),
    }
  },
  plugins: [
    new CleanWebpackPlugin(outputPath),
    new CopyWebpackPlugin([
      {from: './src/manifest.json',},
      {from: './src/icons', to: './icons'},
      {from: './src/_locales', to: './_locales'},
    ]),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: './src/options.html',
      chunks: ['options']
    }),
    new DefinePlugin({
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;