const path = require('path');
const fs = require('fs');

module.exports = (outputPath) => {
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
  return {
    CONTENT_SCRIPT_MAP,
    CONTENT_SCRIPTS
  };
};