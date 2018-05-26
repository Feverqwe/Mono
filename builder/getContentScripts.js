const path = require('path');
const fs = require('fs');
const matchPattern = require('./matchPattern');
const matchGlobPattern = require('./matchGlobPattern');

const output = require('./getOutput');
const source = require('./getSource');

const CONTENT_SCRIPT_INDEX = [];
const CONTENT_SCRIPTS = [];

let index = 0;
const filenameIndexMap = {};

require(path.join(source, './manifest')).content_scripts.map(item => {
  item.js.forEach(filename => {
    if (typeof filenameIndexMap[filename] !== 'number') {
      filenameIndexMap[filename] = index++;
    }
    const idx = filenameIndexMap[filename];
    if (!CONTENT_SCRIPT_INDEX[idx]) {
      CONTENT_SCRIPT_INDEX[idx] = String(fs.readFileSync(path.join(output, filename)));
    }
  });
  CONTENT_SCRIPTS.push({
    matches: [].concat(...item.matches.map(pattern => matchPattern(pattern))).join('|'),
    exclude_matches: item.exclude_matches && [].concat(...item.exclude_matches.map(pattern => matchPattern(pattern))).join('|'),
    include_globs: item.include_globs && [].concat(...item.include_globs.map(pattern => matchGlobPattern(pattern))).join('|'),
    exclude_globs: item.exclude_globs && [].concat(...item.exclude_globs.map(pattern => matchGlobPattern(pattern))).join('|'),
    run_at: item.run_at,
    all_frames: item.all_frames,
    js: item.js.map(filename => filenameIndexMap[filename]),
  });
});

const getWight = (type) => {
  switch (type) {
    case 'document_start': {
      return 2;
    }
    case 'document_end': {
      return 1;
    }
    default: {
      return 0;
    }
  }
};

CONTENT_SCRIPTS.sort(({run_at: aa}, {run_at: bb}) => {
  const a = getWight(aa);
  const b = getWight(bb);
  return a === b ? 0 : a > b ? -1 : 1;
});

module.exports = {
  CONTENT_SCRIPT_INDEX,
  CONTENT_SCRIPTS
};