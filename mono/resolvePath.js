/**
 * @param {Object} scope
 * @param {string} path
 * @return {function}
 */
const resolvePath = (scope, path) => {
  const parts = path.split('.');
  const endPoint = parts.pop();
  while (parts.length) {
    scope = scope[parts.shift()];
  }
  return {scope, endPoint};
};

export default resolvePath;