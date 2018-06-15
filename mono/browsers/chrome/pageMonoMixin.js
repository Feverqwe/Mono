import ChromeStorage from "./storage";
import StorageMixin from "../../storageMixin";

const ChromePageMonoMixin = Parent => class extends Parent {
  initI18n() {
    this.i18n = {
      getMessage: chrome.i18n.getMessage.bind(chrome.i18n)
    };
  }
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
        }, tabs => {
          const tab = tabs[0];
          if (tab && tab.id >= 0) {
            if (response) {
              chrome.tabs.sendMessage(tab.id, message, result => {
                this.lastError = chrome.runtime.lastError;
                response(result);
                this.clearLastError();
              });
            } else {
              chrome.tabs.sendMessage(tab.id, message);
            }
          } else {
            this.lastError = new Error('Active tab is not found');
            response && response();
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
    this.storage = new (StorageMixin(ChromeStorage))(this);
  }
};

export default ChromePageMonoMixin;