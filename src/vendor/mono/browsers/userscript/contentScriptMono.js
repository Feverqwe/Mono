import Mono from "../../mono";
import TransportWithResponse from "../../transportWithResponse";

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
}

export default UserscriptContentScriptMono;