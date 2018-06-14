const fs = require('fs-extra');
const path = require('path');
const getDistPath = require('./getDistPath');

const dist = getDistPath();

const getManifest = () => {
  return fs.readJsonSync(path.join(dist, './manifest.json'));
};

module.exports = getManifest;