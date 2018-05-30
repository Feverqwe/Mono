const path = require('path');
const fs = require('fs');
const getScriptsAndHtmlFormHtml = require('./getScriptsAndBodyFormHtml');

const {dist} = require('./getOutput');

const scriptContent = [];

const html = String(fs.readFileSync(path.join(dist, 'options.html')));
const {scripts, body} = getScriptsAndHtmlFormHtml(html);

scripts.forEach(filename => {
  scriptContent.push(String(fs.readFileSync(path.join(dist, filename))));
});

module.exports = {OPTIONS_SCRIPTS: scriptContent, OPTIONS_PAGE: body};