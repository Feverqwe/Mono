const defineScripts = scripts => {
  // DO NOT REPLACE VAR, env don't fallback it
  const toString = function(){
    var string = this.f.toString();
    var pos = string.indexOf('{') + 1;
    return string.substr(pos, string.lastIndexOf('}') - pos);
  };
  return `[${scripts.map(script => {
    return `{f:${new Function(script).toString()},toString:${toString}}`;
  }).join(',')}]`;
};

module.exports = defineScripts;