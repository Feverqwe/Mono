const escapeStringRegexp = require('escape-string-regexp');

const matchGlobPattern = pattern => {
  let rePattern = escapeStringRegexp(pattern);
  rePattern = rePattern.replace(/\\\*/g, '.*');
  rePattern = rePattern.replace(/\\\?/g, '.{1}');
  return ['^' + rePattern + '$'];
};

module.exports = matchGlobPattern;