import Storage from "../../storage";
import ChromeStorage from "./storage";

const ChromePageMonoMixin = Parent => class extends Parent {
  initMessages() {
    this.transport = {
      sendMessage: (message, response) => {
        if (response) {
          chrome.runtime.sendMessage(message, result => {
            this.lastError = chrome.runtime.lastError;
            response(result);
            this.clearLastError();
          });
        } else {
          chrome.runtime.sendMessage(message);
        }
      },
      sendMessageToActiveTab: (message, response) => {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }).then(tabs => {
          const tab = tabs[0];
          if (tab && tab.id >= 0) {
            if (response) {
              chrome.tabs.sendMessage(tab.id, message, result => {
                this.lastError = chrome.runtime.lastError;
                response(result);
                this.clearLastError();
              });
            } else {
              chrome.tabs.sendMessage(tab.id, messag);
            }
          } else
          if (response) {
            this.lastError = new Error('Active tab is not found');
            response();
            this.clearLastError();
          }
        });
      },
      addListener: (listener) => {
        chrome.runtime.onMessage.addListener(listener);
      },
      hasListener: (listener) => {
        return chrome.runtime.onMessage.hasListener(listener);
      },
      hasListeners: () => {
        return chrome.runtime.onMessage.hasListeners();
      },
      removeListener: (listener) => {
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