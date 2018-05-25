const path = require('path');

let output = null;
process.argv.some((arg, index) => {
  if (arg === '--output-path') {
    output = path.resolve(process.argv[index + 1]);
    return true;
  }
});

module.exports = output;