const path = require('path');
const fs = require('fs');

const output = require('./getOutput');

const POPUP_SCRIPTS = [
  String(fs.readFileSync(path.join(output, 'js/popup.js')))
];

module.exports = POPUP_SCRIPTS;