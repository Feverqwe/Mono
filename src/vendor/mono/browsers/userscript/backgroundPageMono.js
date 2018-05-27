import UserscriptPageMono from "./pageMono";
import TransportWithResponseBackgroundPage from "./transportWithResponseBackgroundPage";

class UserscriptBackgroundPageMono extends UserscriptPageMono {
  initTransport() {
    this.transport = new TransportWithResponseBackgroundPage({
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
    }, this.bundle);
  }
}

export default UserscriptBackgroundPageMono;