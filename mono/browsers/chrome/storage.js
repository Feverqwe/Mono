class ChromeStorage {
  constructor(mono) {
    this.mono = mono;
  }
  callback(callback, result, notOptionalCallback) {
    this.mono.lastError = chrome.runtime.lastError;
    if (notOptionalCallback || callback) {
      callback(result);
    }
    this.mono.clearLastError();
  }
  get(keys, callback) {
    chrome.storage.local.get(keys, result => this.callback(callback, result, true));
  }
  set(items, callback) {
    chrome.storage.local.set(items, () => this.callback(callback));
  }
  remove(keys, callback) {
    chrome.storage.local.remove(keys, () => this.callback(callback));
  }
  clear(callback) {
    chrome.storage.local.clear(() => this.callback(callback));
  }
}

export default ChromeStorage;