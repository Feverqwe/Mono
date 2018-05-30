class ChromeStorage {
  constructor(mono) {
    this.mono = mono;
  }
  get(keys, callback) {
    chrome.storage.local.get(keys, result => {
      this.mono.lastError = chrome.runtime.lastError;
      callback(result);
      this.mono.clearLastError();
    });
  }
  set(items, callback) {
    chrome.storage.local.set(items, () => {
      this.mono.lastError = chrome.runtime.lastError;
      callback && callback();
      this.mono.clearLastError();
    });
  }
  remove(keys, callback) {
    chrome.storage.local.remove(keys, () => {
      this.mono.lastError = chrome.runtime.lastError;
      callback && callback();
      this.mono.clearLastError();
    });
  }
  clear(callback) {
    chrome.storage.local.clear(() => {
      this.mono.lastError = chrome.runtime.lastError;
      callback && callback();
      this.mono.clearLastError();
    });
  }
}

export default ChromeStorage;