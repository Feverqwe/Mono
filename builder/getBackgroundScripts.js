const path = require('path');
const fs = require('fs');

const {src, dist} = require('./getOutput');

const BACKGROUND_SCRIPTS = require(path.join(src, './manifest')).background.scripts.map(filename => {
  return String(fs.readFileSync(path.join(dist, filename)));
});

module.exports = BACKGROUND_SCRIPTS;