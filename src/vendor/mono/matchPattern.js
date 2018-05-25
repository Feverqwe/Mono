const escapeStringRegexp = require('escape-string-regexp');

const getScheme = scheme => {
  if (!scheme || scheme === '*:') {
    return '(?:https?|file|ftp):\/\/';
  }
  return escapeStringRegexp(scheme.toLowerCase()) + '\/\/';
};

const getPath = path => {
  if (!path) {
    return '\/.*';
  }
  return escapeStringRegexp(path.toLowerCase()).replace(/\\\*/g, '.*');
};

const hostnameToRePattern = (scheme, hostname, path) => {
  return '^' + getScheme(scheme) + escapeStringRegexp(hostname.toLowerCase()).replace(/\\\*/g, '.+') + getPath(path) + '$';
};

const matchPattern = (pattern, url) => {
  const regexpList = [];
  if (pattern === '<all_urls>') {
    pattern = '*://*/*';
  }
  const m = /^(?:([^:\/]+:)\/\/)?([^\/]*)(?:(\/[^?#]*))?/.exec(pattern);
  if (m) {
    const scheme = m[1];
    const hostname = m[2];
    const path = m[3];

    const hostnameList = [hostname];
    if (/^\*\./.test(hostname)) {
      hostnameList.push(hostname.substr(2));
    }
    hostnameList.forEach(hostname => {
      regexpList.push(new RegExp(hostnameToRePattern(scheme, hostname, path), 'i'));
    });

    return regexpList.some(re => {
      return re.test(url);
    });
  } else {
    throw new Error('Match pattern error');
  }
};

export default matchPattern;