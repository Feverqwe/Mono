import Storage from "../../storage";
import ChromeStorage from "./storage";
import promisifyApi from "./promisifyApi";

const ChromePageMonoMixin = Parent => class extends Parent {
  initMessages() {
    this.transport = {
      sendMessage(message) {
        return promisifyApi('chrome.runtime.sendMessage')(message);
      },
      sendMessageToActiveTab(message) {
        return promisifyApi('chrome.tabs.query')({
          active: true,
          currentWindow: true
        }).then(tabs => {
          const tab = tabs[0];
          if (tab && tab.id >= 0) {
            return promisifyApi('chrome.tabs.sendMessage')(tab.id, message);
          } else {
            throw new Error('Active tab not found');
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
    this.storage = new Storage(new ChromeStorage());
  }
};

export default ChromePageMonoMixin;