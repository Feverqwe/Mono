const path = require('path');

const isWatch = require('./isWatch');
const source = require('./getSource');

let output = null;
process.argv.some((arg, index) => {
  if (arg === '--1output-path') {
    output = path.resolve(process.argv[index + 1]);
    return true;
  }
});

let dist = path.join(output, 'dist');

let src = path.join(output, 'src');
if (isWatch) {
  src = source;
}

module.exports = {output, dist: dist, src: src};