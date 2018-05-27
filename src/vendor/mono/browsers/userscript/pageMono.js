import Mono from "../../mono";
import {TransportWithResponsePage} from "../../transportWithResponse";

class UserscriptPageMono extends Mono {
  constructor(bundle) {
    super(bundle);
  }
  initTransport() {
    this.transport = new TransportWithResponsePage({
      sendMessage: (message, response) => {
        this.bundle.messaing.emit('page', message, response);
      },
      sendMessageToActiveTab: (message, response) => {
        this.bundle.messaing.emit('toActiveTab', message, response);
      },
    });
  }
  init() {
    super.init();
    this.sendMessageToActiveTab = this.transport.sendMessageToActiveTab.bind(this.transport);
  }
}

export default UserscriptPageMono;