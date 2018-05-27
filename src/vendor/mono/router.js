class Router {
  constructor() {
    this.monoInstances = [];

    this.localeMap = LOCALE_MAP;
    this.contentScripts = CONTENT_SCRIPTS;
    this.contentScriptMap = CONTENT_SCRIPT_MAP;
    this.contentScriptIndex = CONTENT_SCRIPT_INDEX;

    this.contentScriptMono = null;
  }
  createMonoInstance(type) {
    throw new Error(`Instance type (${type}) is not found`);
  }
  addMonoInstance(instance) {
    instance.onDestroy.addListener(() => {
      const pos = this.monoInstances.indexOf(instance);
      if (pos !== -1) {
        this.monoInstances.splice(pos, 1);
      }
    });
    this.monoInstances.push(instance);
  }
  getContentScriptMono() {
    if (!this.contentScriptMono) {
      this.contentScriptMono = this.createMonoInstance('contentScript');
    }
    return this.contentScriptMono;
  }
  inject() {
    const documentEndScripts = [];
    const documentStartScripts = [];
    const documentIdleScripts = [];
    this.contentScripts.forEach(item => {
      if (isMatchItem(item)) {
        item.js.forEach(index => {
          if (item.run_at === 'document_start') {
            if (documentStartScripts.indexOf(index) === -1) {
              documentStartScripts.push(index);
            }
          } else
          if (item.run_at === 'document_end') {
            if (documentEndScripts.indexOf(index) === -1) {
              documentEndScripts.push(index);
            }
          } else {
            if (documentIdleScripts.indexOf(index) === -1) {
              documentIdleScripts.push(index);
            }
          }
        });
      }
    });
    if (documentStartScripts.length) {
      this.runWhenDocumentStart(() => {
        try {
          this.executeContentScript(documentStartScripts.map(index => this.contentScriptIndex[index].toString()).join('\n'));
        } catch (err) {
          console.error('executeContentScript document_start error', err);
        }
      });
    }
    if (documentEndScripts.length) {
      this.runWhenDocumentEnd(() => {
        try {
          this.executeContentScript(documentEndScripts.map(index => this.contentScriptIndex[index].toString()).join('\n'));
        } catch (err) {
          console.error('executeContentScript document_end error', err);
        }
      });
    }
    if (documentIdleScripts.length) {
      this.runWhenDocumentIdle(() => {
        try {
          this.executeContentScript(documentIdleScripts.map(index => this.contentScriptIndex[index].toString()).join('\n'));
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
      if (window.requestIdleCallback) {
        window.requestIdleCallback(listener);
      } else {
        setTimeout(listener, 1);
      }
    });
  }
  executeContentScript(code) {
    return new Function('MONO', code)(this.getContentScriptMono());
  }
}

const isMatchItem = (item) => {
  if (typeof item._isMatch === 'boolean') {
    return item._isMatch;
  }

  let isMatched = window.top === window.self || item.all_frames === true;
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
  return item._isMatch = isMatched;
};

export default Router;