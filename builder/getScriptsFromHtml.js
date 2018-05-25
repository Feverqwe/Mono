const parse5 = require('parse5');

const getScriptsFormHtml = html => {
  const scripts = [];

  const ast = parse5.parse(html);
  const walk = node => {
    if (node.tagName === 'script') {
      node.attrs && node.attrs.some(attr => {
        if (attr.name === 'src') {
          scripts.push(attr.value);
        }
      });
    } else
    if (node.childNodes) {
      node.childNodes.forEach(walk);
    }
  };
  walk(ast);

  return scripts;
};

module.exports = getScriptsFormHtml;