import SafariTransport from "./transport";
import Storage from "../../storage";
import RemoteStorage from "../../remoteStorage";
import ContentScriptMono from "../../contentScriptMono";
import SafariContentScriptApiMixin from "./contentScriptApiMixin";
import StorageChangesListener from "./storageChangesListener";

class SafariContentScriptMono extends SafariContentScriptApiMixin(ContentScriptMono) {
  constructor(router) {
    super();
    this.router = router;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
  initI18n() {
    this.locale = this.router.getLocale();
    this.i18n = {
      getMessage: (message) => {
        const item = this.locale[message];
        return item && item.message || '';
      }
    };
  }
  initMessages() {
    this.transport = new SafariTransport(this, {
      addListener: listener => {
        if (!listener._listener) {
          listener._listener = event => listener(event.message, event);
        }
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
    this.storageChangesListener = new StorageChangesListener(this);
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default SafariContentScriptMono;