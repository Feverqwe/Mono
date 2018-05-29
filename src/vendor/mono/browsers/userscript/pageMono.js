import UserscriptStorage from "./userscriptStorage";
import Storage from "../../storage";
import {TransportWithResponseWithActiveTab} from "../../transportWithResponse";

const UserscriptPageMono = Parent => class extends Parent {
  initMessages() {
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

    super.initMessages(this.transport);
  }
  initStorage() {
    this.storage = new Storage(new UserscriptStorage());
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
};

export default UserscriptPageMono;