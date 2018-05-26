const {JSDOM} = require('jsdom');

const getScriptsAndBodyFormHtml = html => {
  const document = new JSDOM(html).window.document;

  const scripts = Array.from(document.querySelectorAll('script')).map(node => {
    return node.src;
  });

  document.querySelectorAll('script').forEach(node => {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
  });

  const body = document.body.innerHTML.trim();

  return {scripts, body};
};

module.exports = getScriptsAndBodyFormHtml;