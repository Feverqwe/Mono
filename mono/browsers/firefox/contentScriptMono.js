import ContentScriptMono from "../../contentScriptMono";
import FirefoxStorage from "./storage";
import FirefoxContentScriptApiMixin from "./contentScriptApiMixin";
import StorageMixin from "../../storageMixin";

class FirefoxContentScriptMono extends FirefoxContentScriptApiMixin(ContentScriptMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
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
    this.storage = new (StorageMixin(FirefoxStorage))(this);
  }
}

export default FirefoxContentScriptMono;