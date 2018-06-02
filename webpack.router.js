const {DefinePlugin} = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const defineScripts = require('./builder/defineScripts');

const isWatch = require('./builder/isWatch');

const mode = require('./builder/getMode');

const browser = require('./builder/getBrowser');

const mono = require('./builder/getMono');

const {dist} = require('./builder/getOutput');

const {LOCALE_MAP, DEFAULT_LOCALE} = require('./builder/getLocaleMap');

const {CONTENT_SCRIPT_MAP, CONTENT_SCRIPT_INDEX, CONTENT_SCRIPTS} = require('./builder/getContentScripts');

const env = require('./builder/getEnv');

const config = {
  entry: {
    router: 'router',
  },
  output: {
    path: dist,
    filename: 'includes/[name].js'
  },
  mode: mode,
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
      'router': path.join(mono, `./browsers/${browser}/router`),
    }
  },
  plugins: [
    new CleanWebpackPlugin([
      path.join(dist, 'includes')
    ]),
    new DefinePlugin({
      DEFAULT_LOCALE: JSON.stringify(DEFAULT_LOCALE),
      LOCALE_MAP: JSON.stringify(LOCALE_MAP),
      CONTENT_SCRIPTS: JSON.stringify(CONTENT_SCRIPTS),
      CONTENT_SCRIPT_MAP: JSON.stringify(CONTENT_SCRIPT_MAP),
      CONTENT_SCRIPT_INDEX: defineScripts(CONTENT_SCRIPT_INDEX),
      'process.env': {
        DEBUG: JSON.stringify('*')
      }
    }),
  ],
};

module.exports = config;