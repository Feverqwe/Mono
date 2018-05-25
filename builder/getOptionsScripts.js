const path = require('path');
const fs = require('fs');

const output = require('./getOutput');

const OPTIONS_SCRIPTS = [
  String(fs.readFileSync(path.join(output, 'js/options.js')))
];

module.exports = OPTIONS_SCRIPTS;