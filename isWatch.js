const isWatch = process.argv.some(function (arg) {
  return arg === '--watch';
});

module.exports = isWatch;