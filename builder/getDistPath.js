const path = require('path');

const getDistPath = () => {
  const output = BUILD_ENV.outputPath;
  const browser = BUILD_ENV.monoBrowser;
  let dist = path.join(output, 'dist');
  if (browser === 'safari') {
    dist = path.join(output, 'dist.safariextension');
  }
  return dist;
};

module.exports = getDistPath;