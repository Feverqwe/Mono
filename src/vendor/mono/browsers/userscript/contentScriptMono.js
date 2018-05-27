import Mono from "../../mono";
import TransportWithResponse from "../../transportWithResponse";
import Storage from "../../storage";
import UserscriptStorage from "./userscriptStorage";

class UserscriptContentScriptMono extends Mono {
  constructor(bundle) {
    super(bundle);
  }
  initTransport() {
    this.transport = new TransportWithResponse({
      addListener: listener => {
        this.bundle.messaing.addListener('toActiveTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('toActiveTab', listener);
      },
      sendMessage: (message, response) => {
        this.bundle.wakeUpBackgroundPage();
        this.bundle.messaing.emit('fromActiveTab', message, response);
      },
    });
  }
  initStorage() {
    this.storage = new Storage(new UserscriptStorage());
  }
}

export default UserscriptContentScriptMono;