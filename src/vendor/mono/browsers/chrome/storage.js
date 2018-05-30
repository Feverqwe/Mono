import promisifyApi from "./promisifyApi";

class ChromeStorage {
  get(keys) {
    return promisifyApi('chrome.storage.local.get')(keys);
  }
  set(items) {
    return promisifyApi('chrome.storage.local.set')(items);
  }
  remove(keys) {
    return promisifyApi('chrome.storage.local.remove')(keys);
  }
  clear() {
    return promisifyApi('chrome.storage.local.clear')();
  }
}

export default ChromeStorage;