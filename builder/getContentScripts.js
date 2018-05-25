const path = require('path');
const fs = require('fs');

const output = require('./getOutput');
const source = require('./getSource');

const CONTENT_SCRIPT_MAP = {};
const CONTENT_SCRIPTS = [];

require(path.join(source, './manifest')).content_scripts.map(item => {
  item.js.forEach(filename => {
    if (!CONTENT_SCRIPT_MAP[filename]) {
      CONTENT_SCRIPT_MAP[filename] = String(fs.readFileSync(path.join(output, filename)));
    }
  });
  CONTENT_SCRIPTS.push({
    matches: item.matches,
    exclude_matches: item.exclude_matches,
    include_globs: item.include_globs,
    exclude_globs: item.exclude_globs,
    run_at: item.run_at,
    all_frames: item.all_frames,
    js: item.js,
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
  CONTENT_SCRIPT_MAP,
  CONTENT_SCRIPTS
};