const path = require('path');
const fs = require('fs-extra');
const matchPattern = require('./matchPattern');
const matchGlobPattern = require('./matchGlobPattern');
const getManifest = require('./getManifest');
const getDistPath = require('./getDistPath');

const getContentScripts = () => {
  const dist = getDistPath();

  const CONTENT_SCRIPT_MAP = {};
  const CONTENT_SCRIPT_INDEX = [];
  const CONTENT_SCRIPTS = [];

  let index = 0;

  const insertFile = filename => {
    if (typeof CONTENT_SCRIPT_MAP[filename] !== 'number') {
      CONTENT_SCRIPT_MAP[filename] = index++;
    }
    const idx = CONTENT_SCRIPT_MAP[filename];
    if (typeof CONTENT_SCRIPT_INDEX[idx] !== 'string') {
      CONTENT_SCRIPT_INDEX[idx] = String(fs.readFileSync(path.join(dist, filename)));
    }
  };

  getManifest().content_scripts.forEach(item => {
    item.js.forEach(insertFile);
    CONTENT_SCRIPTS.push({
      matches: [].concat(...item.matches.map(pattern => matchPattern(pattern))).join('|'),
      exclude_matches: item.exclude_matches && [].concat(...item.exclude_matches.map(pattern => matchPattern(pattern))).join('|'),
      include_globs: item.include_globs && [].concat(...item.include_globs.map(pattern => matchGlobPattern(pattern))).join('|'),
      exclude_globs: item.exclude_globs && [].concat(...item.exclude_globs.map(pattern => matchGlobPattern(pattern))).join('|'),
      run_at: item.run_at,
      all_frames: item.all_frames,
      js: item.js.map(filename => CONTENT_SCRIPT_MAP[filename]),
    });
  });

  fs.readdirSync(path.join(dist, './includes')).filter(filename => /\.js$/.test(filename)).map(filename => `includes/${filename}`).forEach(insertFile);

  return {
    CONTENT_SCRIPT_MAP,
    CONTENT_SCRIPT_INDEX,
    CONTENT_SCRIPTS
  };
};

module.exports = getContentScripts;