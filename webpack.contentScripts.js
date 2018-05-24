const {DefinePlugin} = require('webpack');
const path = require('path');

const isWatch = require('./isWatch');

const mode = require('./getMode');

const browser = require('./getBrowser');

const outputPath = path.resolve(`./dist/${browser}`);

const env = require('./getEnv');

const config = {
  entry: {
    any: './src/includes/any',
  },
  output: {
    path: outputPath,
    filename: 'includes/[name].js'
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
      'mono': path.resolve(__dirname, `./vendor/mono/browsers/${browser}/contentScript`),
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