import Storage from "../../storage";
import ChromeStorage from "./storage";

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
          const tab = tabs[0];
          if (tab && tab.id >= 0) {
            chrome.tabs.sendMessage(tab.id, message, response);
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