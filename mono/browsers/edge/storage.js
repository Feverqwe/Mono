class EdgeStorage {
  constructor(mono) {
    this.mono = mono;

    this.onChanged = {
      addListener: listener => {
        browser.storage.onChanged.addListener(listener);
      },
      hasListener: listener => {
        return browser.storage.onChanged.hasListener(listener);
      },
      hasListeners: () => {
        return browser.storage.onChanged.hasListeners();
      },
      removeListener: listener => {
        browser.storage.onChanged.removeListener(listener);
      }
    }
  }
  callback(callback, result, notOptionalCallback) {
    this.mono.lastError = browser.runtime.lastError;
    if (notOptionalCallback || callback) {
      callback(result);
    }
    this.mono.clearLastError();
  }
  get(keys, callback) {
    browser.storage.local.get(keys, result => this.callback(callback, result, true));
  }
  set(items, callback) {
    browser.storage.local.set(items, () => this.callback(callback));
  }
  remove(keys, callback) {
    browser.storage.local.remove(keys, () => this.callback(callback));
  }
  clear(callback) {
    browser.storage.local.clear(() => this.callback(callback));
  }
}

export default EdgeStorage;