const path = require('path');
const fs = require('fs');
const getScriptsAndHtmlFormHtml = require('./getScriptsAndBodyFormHtml');
const getDistPath = require('./getDistPath');

const getOptions = () => {
  const dist = getDistPath();

  const scriptContent = [];

  const html = String(fs.readFileSync(path.join(dist, 'options.html')));
  const {scripts, body} = getScriptsAndHtmlFormHtml(html);

  scripts.forEach(filename => {
    scriptContent.push(String(fs.readFileSync(path.join(dist, filename))));
  });

  return {OPTIONS_SCRIPTS: scriptContent, OPTIONS_PAGE: body};
};

module.exports = getOptions;