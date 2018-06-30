import EdgeStorage from "./storage";

const EdgePageMonoMixin = Parent => class extends Parent {
  initI18n() {
    this.i18n = {
      getMessage: browser.i18n.getMessage.bind(browser.i18n)
    };
  }
  initMessages() {
    this.transport = {
      sendMessage: (message, response) => {
        if (response) {
          browser.runtime.sendMessage(message, result => {
            this.lastError = browser.runtime.lastError;
            response(result);
            this.clearLastError();
          });
        } else {
          browser.runtime.sendMessage(message);
        }
      },
      sendMessageToActiveTab: (message, response) => {
        browser.tabs.query({
          active: true,
          currentWindow: true
        }, tabs => {
          const tab = tabs[0];
          if (tab && tab.id >= 0) {
            if (response) {
              browser.tabs.sendMessage(tab.id, message, result => {
                this.lastError = browser.runtime.lastError;
                response(result);
                this.clearLastError();
              });
            } else {
              browser.tabs.sendMessage(tab.id, message);
            }
          } else {
            this.lastError = new Error('Active tab is not found');
            response && response();
            this.clearLastError();
          }
        });
      },
      addListener: (listener) => {
        browser.runtime.onMessage.addListener(listener);
      },
      hasListener: (listener) => {
        return browser.runtime.onMessage.hasListener(listener);
      },
      hasListeners: () => {
        return browser.runtime.onMessage.hasListeners();
      },
      removeListener: (listener) => {
        browser.runtime.onMessage.removeListener(listener);
      }
    };

    super.initMessages();
  }
  initStorage() {
    this.storage = new EdgeStorage(this);
  }
};

export default EdgePageMonoMixin;