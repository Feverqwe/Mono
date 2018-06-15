import ContentScriptMono from "../../contentScriptMono";
import ChromeStorage from "./storage";
import ChromeContentScriptApiMixin from "./contentScriptApiMixin";
import StorageMixin from "../../storageMixin";

class ChromeContentScriptMono extends ChromeContentScriptApiMixin(ContentScriptMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
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
}

export default ChromeContentScriptMono;