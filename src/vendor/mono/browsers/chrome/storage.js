class ChromeStorage {
  get(keys, callback) {
    chrome.storage.local.get(keys, callback);
  }
  set(data, callback) {
    chrome.storage.local.set(data, callback);
  }
  remove(keys, callback) {
    chrome.storage.local.remove(keys, callback);
  }
  clear(callback) {
    chrome.storage.local.clear(callback);
  }
}

export default ChromeStorage;