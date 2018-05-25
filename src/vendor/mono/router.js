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
    const documentEndScripts = [];
    const documentStartScripts = [];
    const documentIdleScripts = [];
    this.contentScripts.forEach(item => {
      const isMatched = item.matches.some(pattern => matchPattern(pattern, location.href));
      if (isMatched) {
        item.js.forEach(filename => {
          if (this.loadedContentScripts.indexOf(filename) === -1) {
            this.loadedContentScripts.push(filename);
            if (item.run_at === 'document_start') {
              documentStartScripts.push(filename);
            } else
            if (item.run_at === 'document_end') {
              documentEndScripts.push(filename);
            } else {
              documentIdleScripts.push(filename);
            }
          }
        });
      }
    });
    if (documentStartScripts.length) {
      this.runWhenDocumentStart(() => {
        try {
          this.executeContentScript(documentStartScripts.map(filename => this.contentScriptMap[filename]).join('\n'));
        } catch (err) {
          console.error('executeContentScript error', err);
        }
      });
    }
    if (documentIdleScripts.length) {
      this.runWhenDocumentIdle(() => {
        try {
          this.executeContentScript(documentIdleScripts.map(filename => this.contentScriptMap[filename]).join('\n'));
        } catch (err) {
          console.error('executeContentScript error', err);
        }
      });
    }
    if (documentEndScripts.length) {
      this.runWhenDocumentEnd(() => {
        try {
          this.executeContentScript(documentEndScripts.map(filename => this.contentScriptMap[filename]).join('\n'));
        } catch (err) {
          console.error('executeContentScript error', err);
        }
      });
    }
  }
  runWhenDocumentStart(listener) {
    listener();
  }
  runWhenDocumentEnd(linstener) {
    this.runWhenDocumentStart(() => {
      if (['interactive', 'complete'].indexOf(document.readyState) !== -1) {
        linstener();
      } else {
        const _listener = () => {
          if (document.readyState === 'interactive') {
            document.removeEventListener('readystatechange', _listener);
            linstener();
          }
        };
        document.addEventListener('readystatechange', _listener);
      }
    });
  }
  runWhenDocumentIdle(linstener) {
    this.runWhenDocumentEnd(() => {
      (window.setImmediate || setTimeout)(() => {
        linstener();
      });
    });
  }
  executeContentScript(code) {
    return new Function('MONO', code)(this.contentScriptMono);
  }
}

export default Router;