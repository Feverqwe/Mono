const escapeStringRegexp = require('escape-string-regexp');

const matchGlobPattern = (pattern, url) => {
  let rePattern = escapeStringRegexp(pattern);
  rePattern = rePattern.replace(/\\\*/g, '.*');
  rePattern = rePattern.replace(/\\\?/g, '.{1}');
  return new RegExp(rePattern, 'i').test(url);
};

export default matchGlobPattern;