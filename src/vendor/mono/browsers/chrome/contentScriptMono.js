import ContentScriptMono from "../../contentScriptMono";
import Storage from "../../storage";
import ChromeStorage from "./storage";

class ChromeContentScriptMono extends ContentScriptMono {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
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
    this.storage = new Storage(this, new ChromeStorage(this));
  }
}

export default ChromeContentScriptMono;