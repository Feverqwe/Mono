const path = require('path');

let mono = null;
process.argv.some((arg, index) => {
  if (arg === '--mono-path') {
    mono = path.resolve(process.argv[index + 1]);
    return true;
  }
});

module.exports = mono;