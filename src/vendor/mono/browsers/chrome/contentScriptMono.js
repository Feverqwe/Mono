import ContentScriptMono from "../../contentScriptMono";
import Storage from "../../storage";
import ChromeStorage from "./storage";
import promisifyApi from "./promisifyApi";

class ChromeContentScriptMono extends ContentScriptMono {
  initMessages() {
    this.transport = {
      sendMessage(message) {
        return promisifyApi('chrome.runtime.sendMessage')(message);
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
}

export default ChromeContentScriptMono;