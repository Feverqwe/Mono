import TransportWithResponse from "../../transportWithResponse";
import Storage from "../../storage";
import UserscriptStorage from "./storage";
import ContentScriptMono from "../../contentScriptMono";

class UserscriptContentScriptMono extends ContentScriptMono {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
  }
  initMessages() {
    this.transport = new TransportWithResponse({
      addListener: listener => {
        this.bundle.messaing.addListener('toActiveTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('toActiveTab', listener);
      },
      sendMessage: message => {
        return Promise.resolve().then(() => {
          return this.bundle.wakeUpBackgroundPage();
        }).then(() => {
          return new Promise(resolve => this.bundle.messaing.emit('fromActiveTab', message, resolve));
        });
      },
    });

    super.initMessages();
  }
  initStorage() {
    this.storage = new Storage(new UserscriptStorage());
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default UserscriptContentScriptMono;