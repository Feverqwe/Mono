import Mono from "../../mono";
import TransportWithResponsePage from "../../TransportWithResponsePage";

class UserscriptPageMono extends Mono {
  constructor(bundle) {
    super(bundle);
  }
  initTransport() {
    this.transport = new TransportWithResponsePage({
      addListener: listener => {
        this.bundle.messaing.addListener('page', listener);
        this.bundle.messaing.addListener('activeTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('page', listener);
        this.bundle.messaing.removeListener('activeTab', listener);
      },
      sendMessage: (message, response) => {
        this.bundle.messaing.emit('page', message, response);
      },
      sendMessageToActiveTab: (message, response) => {
        this.bundle.messaing.emit('activeTab', message, response);
      },
    });
  }
  init() {
    super.init();
    this.sendMessageToActiveTab = this.transport.sendMessageToActiveTab.bind(this.transport);
  }
}

export default UserscriptPageMono;