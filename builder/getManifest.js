const path = require('path');

const {src} = require('./getOutput');

const getManifest = () => {
  return require(path.join(src, './manifest'));
};

module.exports = getManifest;