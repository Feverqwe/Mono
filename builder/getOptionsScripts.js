const path = require('path');
const fs = require('fs');
const getScriptsFormHtml = require('./getScriptsFromHtml');

const output = require('./getOutput');

const OPTIONS_SCRIPTS = [];

const html = String(fs.readFileSync(path.join(output, 'options.html')));
getScriptsFormHtml(html).forEach(filename => {
  OPTIONS_SCRIPTS.push(String(fs.readFileSync(path.join(output, filename))));
});

module.exports = OPTIONS_SCRIPTS;