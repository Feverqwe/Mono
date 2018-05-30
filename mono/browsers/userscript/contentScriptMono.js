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
      sendMessage: (message, response) => {
        this.bundle.wakeUpBackgroundPage().then(() => {
          this.bundle.messaing.emit('fromActiveTab', message, response);
        });
      },
    });

    super.initMessages();
  }
  initStorage() {
    this.storage = new Storage(this, new UserscriptStorage());
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default UserscriptContentScriptMono;