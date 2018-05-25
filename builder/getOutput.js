const path = require('path');

let output = null;
process.argv.some((arg, index) => {
  if (arg === '--output') {
    output = path.resolve(process.argv[index + 1]);
    return true;
  }
});

module.exports = output;