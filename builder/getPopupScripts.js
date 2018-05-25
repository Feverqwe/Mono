const path = require('path');
const fs = require('fs');
const getScriptsFormHtml = require('./getScriptsFromHtml');

const output = require('./getOutput');

const POPUP_SCRIPTS = [];

const html = String(fs.readFileSync(path.join(output, 'popup.html')));
getScriptsFormHtml(html).forEach(filename => {
  POPUP_SCRIPTS.push(String(fs.readFileSync(path.join(output, filename))));
});

module.exports = POPUP_SCRIPTS;