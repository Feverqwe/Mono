const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');

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

let browser = null;
process.argv.some((arg, index) => {
  if (arg === '--mono-browser') {
    browser = process.argv[index + 1];
    return true;
  }
});

const outputPath = path.resolve(`./dist/${browser}`);

const localesPath = path.resolve('./src/_locales');

const LOCALE_MAP = {};
fs.readdirSync(localesPath).forEach(locale => {
  LOCALE_MAP[locale] = require(path.join(localesPath, locale, 'messages.json'));
});

const BACKGROUND_SCRIPTS = require('./src/manifest').background.scripts.map(filename => {
  return String(fs.readFileSync(path.join(outputPath, filename)));
});

const OPTIONS_SCRIPTS = [
  String(fs.readFileSync(path.join(outputPath, 'js/options.js')))
];

const POPUP_SCRIPTS = [
  String(fs.readFileSync(path.join(outputPath, 'js/popup.js')))
];

const CONTENT_SCRIPT_MAP = {};
const CONTENT_SCRIPTS = [];
require('./src/manifest').content_scripts.map(item => {
  item.js.forEach(filename => {
    if (!CONTENT_SCRIPT_MAP[filename]) {
      CONTENT_SCRIPT_MAP[filename] = String(fs.readFileSync(path.join(outputPath, filename)));
    }
  });
  CONTENT_SCRIPTS.push({
    matches: item.matches,
    js: item.js,
  });
});

const env = {
  targets: {
    browsers: ['Chrome >= 36']
  }
};

const config = {
  entry: {
    bundle: 'bundle',
  },
  output: {
    path: outputPath,
    filename: '[name].js'
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
      'bundle': path.resolve(__dirname, `./vendor/mono/browsers/${browser}/bundle`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(outputPath, 'includes'),
      path.join(outputPath, 'js'),
      path.join(outputPath, '_locales'),
      path.join(outputPath, 'options.html'),
      path.join(outputPath, 'popup.html'),
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