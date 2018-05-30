const LocaleMixin = Parent => class extends Parent {
  constructor() {
    super();

    this.defaultLocale = DEFAULT_LOCALE;
    this.localeMap = LOCALE_MAP;
  }
  getLocale() {
    let locale = null;
    const language = navigator.language;
    if (language) {
      locale = this.localeMap[language.substr(0, 2)];
    }
    if (!locale) {
      locale = this.localeMap[this.defaultLocale];
    }
    return locale;
  }
};

export default LocaleMixin;