const {DefinePlugin, BannerPlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');
const defineScripts = require('./builder/defineScripts');
const getDistPath = require('./builder/getDistPath');
const getBackgroundScripts = require('./builder/getBackgroundScripts');
const getContentScripts = require('./builder/getContentScripts');
const getLocaleMap = require('./builder/getLocaleMap');
const getOptions = require('./builder/getOptions');
const getPopup = require('./builder/getPopup');

const mode = BUILD_ENV.mode;

const browser = BUILD_ENV.monoBrowser;

const monoPath = BUILD_ENV.monoPath;

const distPath = getDistPath();

const {LOCALE_MAP, DEFAULT_LOCALE} = getLocaleMap();

const BACKGROUND_SCRIPTS = getBackgroundScripts();

const {OPTIONS_SCRIPTS, OPTIONS_PAGE} = getOptions();

const {POPUP_SCRIPTS, POPUP_PAGE} = getPopup();

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPT_INDEX, CONTENT_SCRIPTS} = getContentScripts();

const meta = String(fs.readFileSync(path.join(distPath, `./meta.txt`)));

const jsRulesUseArray = [];

const config = {
  entry: {
    bundle: 'bundle',
  },
  output: {
    path: distPath,
    filename: '[name].js'
  },
  mode: mode,
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [
              [require('./builder/babel-plugin-define'), {
                BACKGROUND_SCRIPTS: defineScripts(BACKGROUND_SCRIPTS),
                OPTIONS_PAGE: JSON.stringify(OPTIONS_PAGE),
                OPTIONS_SCRIPTS: defineScripts(OPTIONS_SCRIPTS),
                POPUP_PAGE: JSON.stringify(POPUP_PAGE),
                POPUP_SCRIPTS: defineScripts(POPUP_SCRIPTS),
                CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
                CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
                CONTENT_SCRIPT_INDEX: defineScripts(CONTENT_SCRIPT_INDEX),
              }]
            ],
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsRulesUseArray
      },
    ]
  },
  resolve: {
    alias: {
      'bundle': path.join(monoPath, `./browsers/${browser}/bundle`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(distPath, 'includes'),
      path.join(distPath, 'js'),
      path.join(distPath, 'options.html'),
      path.join(distPath, 'popup.html'),
      path.join(distPath, '_locales'),
      path.join(distPath, 'manifest.json'),
    ]),
    new BannerPlugin({
      banner: meta,
      raw: true,
      entryOnly: true
    }),
    new DefinePlugin({
      DEFAULT_LOCALE: JSON.stringify(DEFAULT_LOCALE),
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      'process.env': {
        DEBUG: JSON.stringify('*'),
      },
    })
  ],
};

if (BUILD_ENV.babelOptions) {
  jsRulesUseArray.push({
    loader: 'babel-loader',
    options: BUILD_ENV.babelOptions
  });
}

module.exports = config;