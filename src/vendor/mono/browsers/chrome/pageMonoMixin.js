import Storage from "../../storage";

const ChromePageMonoMixin = Parent => class extends Parent {
  initMessages() {
    this.transport = {
      sendMessage(message, response) {
        chrome.runtime.sendMessage(message, response);
      },
      sendMessageToActiveTab(message, response) {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, tabs => {
          const tabId = tabs[0] && tabs[0].id;
          if (tabId >= 0) {
            chrome.tabs.sendMessage(tabId, message, response);
          }
        });
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
};

export default ChromePageMonoMixin;