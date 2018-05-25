const path = require('path');
const fs = require('fs');

const output = require('./getOutput');
const source = require('./getSource');

const CONTENT_SCRIPT_MAP = {};
const CONTENT_SCRIPTS = [];

require(path.join(source, './manifest')).content_scripts.map(item => {
  item.js.forEach(filename => {
    if (!CONTENT_SCRIPT_MAP[filename]) {
      CONTENT_SCRIPT_MAP[filename] = String(fs.readFileSync(path.join(output, filename)));
    }
  });
  CONTENT_SCRIPTS.push({
    matches: item.matches,
    js: item.js,
  });
});

module.exports = {
  CONTENT_SCRIPT_MAP,
  CONTENT_SCRIPTS
};