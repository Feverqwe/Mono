import LocaleMixin from "./localeMixin";

class Router extends LocaleMixin(class {}) {
  constructor() {
    super();

    this.monoInstances = [];

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
        this.executeContentScripts(documentStartScripts);
      });
    }
    if (documentEndScripts.length) {
      this.runWhenDocumentEnd(() => {
        this.executeContentScripts(documentEndScripts);
      });
    }
    if (documentIdleScripts.length) {
      this.runWhenDocumentIdle(() => {
        this.executeContentScripts(documentIdleScripts);
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
  executeContentScripts(idxs) {
    return this.executeScripts(idxs.map(index => {
      return this.contentScriptIndex[index];
    }), this.getContentScriptMono());
  }
  executeScripts(scripts, mono) {
    scripts.forEach(script => {
      try {
        script(mono);
      } catch (err) {
        console.error('executeScript error', err);
      }
    });
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