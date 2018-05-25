const path = require('path');
const fs = require('fs');

const output = require('./getOutput');
const source = require('./getSource');

const BACKGROUND_SCRIPTS = require(path.join(source, './manifest')).background.scripts.map(filename => {
  return String(fs.readFileSync(path.join(output, filename)));
});

module.exports = BACKGROUND_SCRIPTS;