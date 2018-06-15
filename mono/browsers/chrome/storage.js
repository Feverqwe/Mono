class ChromeStorage {
  constructor(mono) {
    this.mono = mono;

    this.onChanged = {
      addListener: listener => {
        chrome.storage.onChanged.addListener(listener);
      },
      hasListener: listener => {
        return chrome.storage.onChanged.hasListener(listener);
      },
      hasListeners: () => {
        return chrome.storage.onChanged.hasListeners();
      },
      removeListener: listener => {
        chrome.storage.onChanged.removeListener(listener);
      }
    }
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