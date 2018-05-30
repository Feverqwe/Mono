import Transport from "../../transport";
import Storage from "../../storage";
import RemoteStorage from "../../remoteStorage";
import ContentScriptMono from "../../contentScriptMono";
import LocaleMixin from "../../localeMixin";

class SafariContentScriptMono extends LocaleMixin(ContentScriptMono) {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
  initI18n() {
    this.locale = this.getLocale();
    this.i18n = {
      getMessage: (message) => {
        return this.locale[message].message;
      }
    };
  }
  initMessages() {
    this.transport = new Transport({
      addListener: listener => {
        listener._listener = event => listener(event.message, event);
        safari.self.addEventListener('message', listener._listener);
      },
      removeListener: listener => {
        if (listener._listener) {
          safari.self.removeEventListener('message', listener._listener);
        }
      },
      sendMessage: message => {
        safari.self.tab.dispatchMessage('message', message);
      },
      sendMessageTo: (message, event) => {
        if (event.target.tab) {
          event.target.tab.dispatchMessage("message", message);
        } else {
          throw new Error('event.target.tab is not exists');
        }
      }
    });

    super.initMessages();
  }
  initStorage() {
    this.storage = new Storage(this, new RemoteStorage(this));
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default SafariContentScriptMono;