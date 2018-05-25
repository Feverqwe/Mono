import matchPattern from "./matchPattern";

class Router {
  constructor() {
    this.contentScriptMono = null;
    this.contentScripts = CONTENT_SCRIPTS;
    this.contentScriptMap = CONTENT_SCRIPT_MAP;
    this.loadedContentScripts = [];
  }
  inject() {
    const scripts = [];
    this.contentScripts.forEach(item => {
      const isMatched = item.matches.some(pattern => matchPattern(pattern, location.href));
      if (isMatched) {
        item.js.forEach(filename => {
          if (this.loadedContentScripts.indexOf(filename) === -1) {
            this.loadedContentScripts.push(filename);
            scripts.push(this.contentScriptMap[filename]);
          }
        });
      }
    });
    if (scripts.length) {
      this.executeContentScript(scripts.join('\n'));
    }
  }
  executeContentScript(code) {
    return new Function('MONO', code)(this.contentScriptMono);
  }
}

export default Router;