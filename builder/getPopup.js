const path = require('path');
const fs = require('fs');
const getScriptsAndHtmlFormHtml = require('./getScriptsAndBodyFormHtml');

const output = require('./getOutput');

const scriptContent = [];

const html = String(fs.readFileSync(path.join(output, 'popup.html')));
const {scripts, body} = getScriptsAndHtmlFormHtml(html);

scripts.forEach(filename => {
  scriptContent.push(String(fs.readFileSync(path.join(output, filename))));
});

module.exports = {POPUP_SCRIPTS: scriptContent, POPUP_PAGE: body};