const path = require('path');
const fs = require('fs-extra');
const getDistPath = require('./getDistPath');
const getManifest = require('./getManifest');

const getBackgroundScripts = () => {
  const dist = getDistPath();

  const BACKGROUND_SCRIPTS = getManifest().background.scripts.map(filename => {
    return String(fs.readFileSync(path.join(dist, filename)));
  });

  return BACKGROUND_SCRIPTS;
};

module.exports = getBackgroundScripts;