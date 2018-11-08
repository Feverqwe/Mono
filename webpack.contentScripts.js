require('./builder/defaultBuildEnv');
const {DefinePlugin} = require('webpack');
const path = require('path');
const getDistPath = require('./builder/getDistPath');

const mode = BUILD_ENV.mode;

const sourcePath = BUILD_ENV.sourcePath;

const browser = BUILD_ENV.monoBrowser;

const monoPath = BUILD_ENV.monoPath;

const distPath = getDistPath();

const jsRulesUseArray = [];

const config = {
  entry: {
    any: path.join(sourcePath, './includes/any'),
    anyFrame: path.join(sourcePath, './includes/anyFrame'),
    ya: path.join(sourcePath, './includes/ya'),
    yaFrame: path.join(sourcePath, './includes/yaFrame'),
  },
  output: {
    path: distPath,
    filename: 'includes/[name].js',
  },
  mode: mode,
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsRulesUseArray
      },
    ]
  },
  resolve: {
    alias: {
      'mono': path.join(monoPath, `./browsers/${browser}/contentScript`),
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        DEBUG: JSON.stringify('*'),
      },
    }),
  ],
};

if (!['safari', 'userscript'].includes(browser)) {
  if (BUILD_ENV.babelOptions) {
    jsRulesUseArray.push({
      loader: 'babel-loader',
      options: BUILD_ENV.babelOptions
    });
  }
}

module.exports = config;