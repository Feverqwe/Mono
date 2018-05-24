const {DefinePlugin} = require('webpack');
const path = require('path');

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

const env = {
  targets: {
    browsers: ['Chrome >= 36']
  }
};

const config = {
  entry: {
    background: './src/js/background',
  },
  output: {
    path: outputPath,
    filename: 'js/[name].js'
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
      'mono': path.resolve(__dirname, `./vendor/mono/browsers/${browser}/backgroundPage`),
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