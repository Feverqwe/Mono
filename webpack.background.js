const {DefinePlugin} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const mono = require('./builder/getMono');

const {src, dist} = require('./builder/getOutput');

const env = require('./builder/getEnv');

const config = {
  entry: {
    background: path.join(src, 'js/background'),
  },
  output: {
    path: dist,
    filename: 'js/[name].js'
  },
  mode: mode,
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
      'mono': path.join(mono, `./browsers/${browser}/backgroundPage`),
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        DEBUG: JSON.stringify('*')
      }
    }),
  ],
};

if (browser === 'safari') {
  const {LOCALE_MAP, DEFAULT_LOCALE} = require('./builder/getLocaleMap');

  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'background.html',
      template: path.join(src, './background.html'),
      chunks: ['background'],
      minify: {
        html5: true,
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new DefinePlugin({
      DEFAULT_LOCALE: JSON.stringify(DEFAULT_LOCALE),
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
    })
  );
}

module.exports = config;