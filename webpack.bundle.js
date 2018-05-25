const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const source = require('./builder/getSource');

const output = require('./builder/getOutput');

const localesPath = path.resolve(path.join(source, './_locales'));

const LOCALE_MAP = {};
fs.readdirSync(localesPath).forEach(locale => {
  LOCALE_MAP[locale] = require(path.join(localesPath, locale, 'messages.json'));
});

const BACKGROUND_SCRIPTS = require(path.join(source, './manifest')).background.scripts.map(filename => {
  return String(fs.readFileSync(path.join(output, filename)));
});

const OPTIONS_SCRIPTS = [
  String(fs.readFileSync(path.join(output, 'js/options.js')))
];

const POPUP_SCRIPTS = [
  String(fs.readFileSync(path.join(output, 'js/popup.js')))
];

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPTS} = require('./builder/getContentScripts')(output);

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
    new DefinePlugin({
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      BACKGROUND_SCRIPTS: JSON.stringify(BACKGROUND_SCRIPTS),
      OPTIONS_SCRIPTS: JSON.stringify(OPTIONS_SCRIPTS),
      POPUP_SCRIPTS: JSON.stringify(POPUP_SCRIPTS),
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;