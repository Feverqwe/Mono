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
    router: 'router',
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
      'router': path.resolve(__dirname, `./vendor/mono/browsers/${browser}/router`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(outputPath, 'includes')
    ]),
    new DefinePlugin({
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      'process.env': {
        'DEBUG': JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;