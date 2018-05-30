class FirefoxStorage {
  constructor(mono) {
    this.mono = mono;
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

export default FirefoxStorage;