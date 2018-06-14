import Transport from "../../transport";
import Storage from "../../storage";
import GmStorage from "./gmStorage";
import UserscriptStorage from "./storage";
import ContentScriptMono from "../../contentScriptMono";
import UserscriptContentScriptApiMixin from "./contentScriptApiMixin";

class UserscriptContentScriptMono extends UserscriptContentScriptApiMixin(ContentScriptMono) {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
    this.initI18n();
  }
  initI18n() {
    this.locale = this.bundle.getLocale();
    this.i18n = {
      getMessage: (message) => {
        const item = this.locale[message];
        return item && item.message || '';
      }
    };
  }
  initMessages() {
    this.transport = new Transport({
      addListener: listener => {
        this.bundle.messaing.addListener('toActiveTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('toActiveTab', listener);
      },
      sendMessage: (message, response) => {
        this.bundle.wakeUpBackgroundPage();
        message.sender.tab = {url: location.href};
        const result = this.bundle.messaing.emit('fromActiveTab', message, response);
        if (!result) {
          console.info('No one received a message');
          response();
        }
      },
    });

    super.initMessages();
  }
  initStorage() {
    if (typeof GM === 'object') {
      this.storage = new Storage(this, new GmStorage());
    } else {
      this.storage = new Storage(this, new UserscriptStorage());
    }
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default UserscriptContentScriptMono;