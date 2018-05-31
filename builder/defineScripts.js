const defineScripts = scripts => {
  return `[${scripts.map(script => {
    return `function(MONO){\n${script}\n}`;
  }).join(',')}]`;
};

module.exports = defineScripts;