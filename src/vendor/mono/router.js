import matchPattern from "./matchPattern";

class Router {
  constructor() {
    this.localeMap = LOCALE_MAP;
    this.contentScriptMono = null;
    this.contentScripts = CONTENT_SCRIPTS;
    this.contentScriptMap = CONTENT_SCRIPT_MAP;
    this.loadedContentScripts = [];
  }
  hasInjectScripts() {
    return this.contentScripts.some(item => item.matches.some(pattern => matchPattern(pattern, location.href)));
  }
  inject() {
    const scripts = [];
    this.contentScripts.forEach(item => {
      const isMatched = item.matches.some(pattern => matchPattern(pattern, location.href));
      if (isMatched) {
        item.js.forEach(filename => {
          if (this.loadedContentScripts.indexOf(filename) === -1) {
            this.loadedContentScripts.push(filename);
            scripts.push(filename);
          }
        });
      }
    });
    if (scripts.length) {
      try {
        this.executeContentScript(scripts.map(filename => this.contentScriptMap[filename]).join('\n'));
      } catch (err) {
        console.error('executeContentScript error', err);
      }
    }
  }
  executeContentScript(code) {
    return new Function('MONO', code)(this.contentScriptMono);
  }
}

export default Router;