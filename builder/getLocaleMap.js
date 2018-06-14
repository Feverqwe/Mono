const path = require('path');
const fs = require('fs-extra');
const getManifest = require('./getManifest');
const getDistPath = require('./getDistPath');

const getLocaleMap = () => {
  const dist = getDistPath();

  const localesPath = path.join(dist, './_locales');

  const LOCALE_MAP = {};
  fs.readdirSync(localesPath).forEach(locale => {
    LOCALE_MAP[locale] = require(path.join(localesPath, locale, 'messages.json'));
  });

  const DEFAULT_LOCALE = getManifest().default_locale;

  return {DEFAULT_LOCALE, LOCALE_MAP};
};

module.exports = getLocaleMap;