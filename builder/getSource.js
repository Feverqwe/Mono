const path = require('path');

let source = null;
process.argv.some((arg, index) => {
  if (arg === '--source-path') {
    source = path.resolve(process.argv[index + 1]);
    return true;
  }
});

module.exports = source;