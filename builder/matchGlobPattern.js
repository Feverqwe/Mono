const escapeStringRegexp = require('escape-string-regexp');

const getScheme = scheme => {
  return escapeStringRegexp(scheme.toLowerCase()).replace(/\\\*/g, '[^:]*') + '\/\/';
};

const getPath = path => {
  return escapeStringRegexp(path.toLowerCase()).replace(/\\\*/g, '.*');
};

const hostnameToRePattern = (scheme, hostname, path) => {
  return '^' + getScheme(scheme) + escapeStringRegexp(hostname.toLowerCase()).replace(/\\\*/g, '[^\\/]*') + getPath(path) + '$';
};

const matchGlobPattern = pattern => {
  const m = /^([^:\/]+:)\/\/([^\/]*)(\/.*)/.exec(pattern);
  if (m) {
    const scheme = m[1];
    const hostname = m[2];
    const path = m[3];
    return [hostnameToRePattern(scheme, hostname, path).replace(/\\\?/g, '.{1}')];
  } else {
    let rePattern = escapeStringRegexp(pattern);
    rePattern = rePattern.replace(/\\\*/g, '.*');
    rePattern = rePattern.replace(/\\\?/g, '.{1}');
    return ['^' + rePattern + '$'];
  }
};

module.exports = matchGlobPattern;