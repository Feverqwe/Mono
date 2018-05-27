import Mono from "../../mono";
import {TransportWithResponseWithActiveTab} from "../../transportWithResponse";
import Storage from "../../storage";
import UserscriptStorage from "./userscriptStorage";

class UserscriptPageMono extends Mono {
  constructor(bundle) {
    super(bundle);
  }
  initTransport() {
    this.transport = new TransportWithResponseWithActiveTab({
      addListener: listener => {
        this.bundle.messaing.addListener('page', listener);
        this.bundle.messaing.addListener('fromActiveTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('page', listener);
        this.bundle.messaing.removeListener('fromActiveTab', listener);
      },
      sendMessage: (message, response) => {
        this.bundle.messaing.emit('page', message, response);
      },
      sendMessageToActiveTab: (message, response) => {
        this.bundle.messaing.emit('toActiveTab', message, response);
      },
    });
  }
  initStorage() {
    this.storage = new Storage(new UserscriptStorage());
  }
  init() {
    super.init();
    this.sendMessageToActiveTab = this.transport.sendMessageToActiveTab.bind(this.transport);
  }
}

export default UserscriptPageMono;