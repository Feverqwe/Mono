const {DefinePlugin, BannerPlugin} = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');
const defineScripts = require('./builder/defineScripts');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const source = require('./builder/getSource');

const output = require('./builder/getOutput');

const LOCALE_MAP = require('./builder/getLocaleMap');

const BACKGROUND_SCRIPTS = require('./builder/getBackgroundScripts');

const {OPTIONS_SCRIPTS, OPTIONS_PAGE} = require('./builder/getOptions');

const {POPUP_SCRIPTS, POPUP_PAGE} = require('./builder/getPopup');

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPT_INDEX, CONTENT_SCRIPTS} = require('./builder/getContentScripts');

let meta = String(fs.readFileSync(path.join(source, `./vendor/mono/browsers/${browser}/meta.txt`)));
meta = meta.replace('{version}', require(path.join(source, 'manifest')).version);

const env = require('./builder/getEnv');

const config = {
  entry: {
    bundle: 'bundle',
  },
  output: {
    path: output,
    filename: '[name].js'
  },
  mode: mode,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          output: {
            beautify: true,
            comments: /^\s+(@|==\/?UserScript==)/,
          }
        }
      })
    ]
  },
  devtool: 'none',
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
      'bundle': path.join(source, `./vendor/mono/browsers/${browser}/bundle`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(output, 'includes'),
      path.join(output, 'js'),
      path.join(output, '_locales'),
      path.join(output, 'options.html'),
      path.join(output, 'popup.html'),
    ]),
    new BannerPlugin({
      banner: meta,
      raw: true,
      entryOnly: true
    }),
    new DefinePlugin({
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      BACKGROUND_SCRIPTS: defineScripts(BACKGROUND_SCRIPTS),
      OPTIONS_PAGE: JSON.stringify(OPTIONS_PAGE),
      OPTIONS_SCRIPTS: defineScripts(OPTIONS_SCRIPTS),
      POPUP_PAGE: JSON.stringify(POPUP_PAGE),
      POPUP_SCRIPTS: defineScripts(POPUP_SCRIPTS),
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      CONTENT_SCRIPT_INDEX: defineScripts(CONTENT_SCRIPT_INDEX),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;