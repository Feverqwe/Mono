const preferredLanguages = require('negotiator/lib/language').preferredLanguages;

const LocaleMixin = Parent => class extends Parent {
  constructor() {
    super();

    this.defaultLocale = DEFAULT_LOCALE;
    this.localeMap = LOCALE_MAP;
  }
  getLocale() {
    let availableLanguages = [];
    if (Array.isArray(navigator.languages)) {
      availableLanguages = navigator.languages;
    } else
    if (navigator.language) {
      availableLanguages = [navigator.language];
    }
    const languages = preferredLanguages(availableLanguages.join(','), Object.keys(this.localeMap));
    let locale = null;
    if (languages) {
      locale = this.localeMap[languages[0]];
    }
    if (!locale) {
      locale = this.localeMap[this.defaultLocale];
    }
    return locale;
  }
};

export default LocaleMixin;