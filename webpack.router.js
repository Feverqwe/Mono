const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const defineScripts = require('./builder/defineScripts');
const getDistPath = require('./builder/getDistPath');
const getContentScripts = require('./builder/getContentScripts');
const getLocaleMap = require('./builder/getLocaleMap');

const mode = BUILD_ENV.mode;

const browser = BUILD_ENV.monoBrowser;

const monoPath = BUILD_ENV.monoPath;

const distPath = getDistPath();

const {LOCALE_MAP, DEFAULT_LOCALE} = getLocaleMap();

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPT_INDEX, CONTENT_SCRIPTS} = getContentScripts();

const jsRulesUseArray = [];

const config = {
  entry: {
    router: 'router',
  },
  output: {
    path: distPath,
    filename: 'includes/[name].js'
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
      'router': path.join(monoPath, `./browsers/${browser}/router`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(distPath, 'includes'),
      path.join(distPath, '_locales'),
      path.join(distPath, 'manifest.json')
    ]),
    new DefinePlugin({
      DEFAULT_LOCALE: JSON.stringify(DEFAULT_LOCALE),
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      'process.env': {
        DEBUG: JSON.stringify("*"),
      },
    }),
  ],
};

if (BUILD_ENV.babelOptions) {
  jsRulesUseArray.push({
    loader: 'babel-loader',
    options: BUILD_ENV.babelOptions
  });
}

module.exports = config;