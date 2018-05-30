const path = require('path');
const fs = require('fs');

const {src} = require('./getOutput');

const localesPath = path.join(src, './_locales');

const LOCALE_MAP = {};
fs.readdirSync(localesPath).forEach(locale => {
  LOCALE_MAP[locale] = require(path.join(localesPath, locale, 'messages.json'));
});

module.exports = LOCALE_MAP;