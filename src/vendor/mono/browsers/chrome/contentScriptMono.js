import ContentScriptMono from "../../contentScriptMono";
import Storage from "../../storage";

class ChromeContentScriptMono extends ContentScriptMono {
  initMessages() {
    this.transport = {
      sendMessage(message, response) {
        chrome.runtime.sendMessage(message, response);
      },
      addListener(listener) {
        chrome.runtime.onMessage.addListener(listener);
      },
      hasListener(listener) {
        return chrome.runtime.onMessage.hasListener(listener);
      },
      hasListeners() {
        return chrome.runtime.onMessage.hasListeners();
      },
      removeListener(listener) {
        chrome.runtime.onMessage.removeListener(listener);
      }
    };

    super.initMessages();
  }
  initStorage() {
    this.storage = new Storage({
      get(keys, callback) {
        chrome.storage.local.get(keys, callback);
      },
      set(data, callback) {
        chrome.storage.local.set(data, callback);
      },
      remove(keys, callback) {
        chrome.storage.local.remove(keys, callback);
      },
      clear(callback) {
        chrome.storage.local.clear(callback);
      }
    });
  }
}

export default ChromeContentScriptMono;