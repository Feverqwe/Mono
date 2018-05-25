class Router {
  constructor() {
    this.localeMap = LOCALE_MAP;
    this.contentScriptMono = null;
    this.contentScripts = CONTENT_SCRIPTS;
    this.contentScriptMap = CONTENT_SCRIPT_MAP;
    this.loadedContentScripts = [];
  }
  hasInjectScripts() {
    return this.contentScripts.some(item => isMatchItem(item));
  }
  inject() {
    const documentEndScripts = [];
    const documentStartScripts = [];
    const documentIdleScripts = [];
    this.contentScripts.forEach(item => {
      if (isMatchItem(item)) {
        item.js.forEach(index => {
          if (this.loadedContentScripts.indexOf(index) === -1) {
            this.loadedContentScripts.push(index);
            if (item.run_at === 'document_start') {
              documentStartScripts.push(index);
            } else
            if (item.run_at === 'document_end') {
              documentEndScripts.push(index);
            } else {
              documentIdleScripts.push(index);
            }
          }
        });
      }
    });
    if (documentStartScripts.length) {
      this.runWhenDocumentStart(() => {
        try {
          this.executeContentScript(documentStartScripts.map(index => this.contentScriptMap[index]).join('\n'));
        } catch (err) {
          console.error('executeContentScript document_start error', err);
        }
      });
    }
    if (documentEndScripts.length) {
      this.runWhenDocumentEnd(() => {
        try {
          this.executeContentScript(documentEndScripts.map(index => this.contentScriptMap[index]).join('\n'));
        } catch (err) {
          console.error('executeContentScript document_end error', err);
        }
      });
    }
    if (documentIdleScripts.length) {
      this.runWhenDocumentIdle(() => {
        try {
          this.executeContentScript(documentIdleScripts.map(index => this.contentScriptMap[index]).join('\n'));
        } catch (err) {
          console.error('executeContentScript document_idle error', err);
        }
      });
    }
  }
  runWhenDocumentStart(listener) {
    listener();
  }
  runWhenDocumentEnd(listener) {
    this.runWhenDocumentStart(() => {
      if (['interactive', 'complete'].indexOf(document.readyState) !== -1) {
        listener();
      } else {
        const _listener = () => {
          if (['interactive', 'complete'].indexOf(document.readyState) !== -1) {
            document.removeEventListener('DOMContentLoaded', _listener);
            window.removeEventListener('load', _listener);
            listener && listener();
            listener = null;
          }
        };
        document.addEventListener('DOMContentLoaded', _listener);
        window.addEventListener('load', _listener);
      }
    });
  }
  runWhenDocumentIdle(listener) {
    this.runWhenDocumentEnd(() => {
      (window.setImmediate || setTimeout)(() => {
        listener();
      });
    });
  }
  executeContentScript(code) {
    return new Function('MONO', code)(this.contentScriptMono);
  }
}


const isMatchItem = (item) => {
  let isMatched = window.top !== window.self ? item.all_frames : true;
  if (isMatched) {
    isMatched = (new RegExp(item.matches, 'i')).test(location.href);
  }
  if (isMatched && item.exclude_matches) {
    isMatched = !(new RegExp(item.exclude_matches, 'i')).test(location.href);
  }
  if (isMatched && item.include_globs) {
    isMatched = (new RegExp(item.include_globs, 'i')).test(location.href);
  }
  if (isMatched && item.exclude_globs) {
    isMatched = !(new RegExp(item.exclude_globs, 'i')).test(location.href);
  }
  return isMatched;
};

export default Router;