require('./builder/defaultBuildEnv');
const {DefinePlugin} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const getDistPath = require('./builder/getDistPath');
const getLocaleMap = require('./builder/getLocaleMap');

const mode = BUILD_ENV.mode;

const devtool = BUILD_ENV.devtool;

const sourcePath = BUILD_ENV.sourcePath;

const browser = BUILD_ENV.monoBrowser;

const monoPath = BUILD_ENV.monoPath;

const distPath = getDistPath();

const jsRulesUseArray = [];

const config = {
  entry: {
    popup: path.join(sourcePath, './js/popup'),
    options: path.join(sourcePath, './js/options'),
  },
  output: {
    path: distPath,
    filename: 'js/[name].js',
  },
  mode: mode,
  devtool: devtool,
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: jsRulesUseArray
      },
    ]
  },
  resolve: {
    alias: {
      'mono': path.join(monoPath, `./browsers/${browser}/page`),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: path.join(sourcePath, './popup.html'),
      chunks: ['menu'],
      minify: {
        html5: true,
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: path.join(sourcePath, './options.html'),
      chunks: ['options'],
      minify: {
        html5: true,
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new DefinePlugin({
      'process.env': {
        DEBUG: JSON.stringify('*'),
      },
    }),
  ],
};

if (!['userscript'].includes(browser)) {
  if (BUILD_ENV.babelOptions) {
    jsRulesUseArray.push({
      loader: 'babel-loader',
      options: BUILD_ENV.babelOptions
    });
  }
}

if (browser === 'safari') {
  const {LOCALE_MAP, DEFAULT_LOCALE} = getLocaleMap();

  config.plugins.push(
    new DefinePlugin({
      DEFAULT_LOCALE: JSON.stringify(DEFAULT_LOCALE),
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
    })
  );
}

module.exports = config;