import Mono from "../../mono";
import TransportWithResponse from "../../transportWithResponse";

class UserscriptContentScriptMono extends Mono {
  constructor(bundle) {
    super(bundle);
  }
  initTransport() {
    this.transport = new TransportWithResponse({
      addListener: listener => {
        this.bundle.messaing.addListener('activeTab', listener);
      },
      removeListener: listener => {
        this.bundle.messaing.removeListener('activeTab', listener);
      },
      sendMessage: (message, response) => {
        this.bundle.wakeUpBackgroundPage();
        this.bundle.messaing.emit('activeTab', message, response);
      },
    });
  }
}

export default UserscriptContentScriptMono;