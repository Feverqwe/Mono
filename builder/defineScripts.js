const defineScripts = scripts => {
  return `[${scripts.map(script => {
    const fn = new Function(script);
    fn.name = '';
    return fn;
  }).join(',')}]`;
};

module.exports = defineScripts;