import SafariTransport from "./transport";
import RemoteStorage from "../../remoteStorage";
import ContentScriptMono from "../../contentScriptMono";
import SafariContentScriptApiMixin from "./contentScriptApiMixin";
import StorageMixin from "../../storageMixin";
import SafariStorageChangesMixin from "./storageChangesMixin";

class SafariContentScriptMono extends SafariContentScriptApiMixin(ContentScriptMono) {
  constructor(router) {
    super();
    this.router = router;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
  initI18n() {
    this.i18n = {
      getMessage: (message) => {
        if (!this.locale) {
          this.locale = this.router.getLocale();
        }
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
    this.storage = new (StorageMixin(SafariStorageChangesMixin(RemoteStorage)))(this);
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default SafariContentScriptMono;