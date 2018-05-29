import Transport from "../../transport";
import Storage from "../../storage";
import RemoteStorage from "../../remoteStorage";
import ContentScriptMono from "../../contentScriptMono";

class SafariContentScriptMono extends ContentScriptMono {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
  initMessages() {
    this.transport = new Transport({
      addListener: listener => {
        listener._listener = event => listener(event.message, event);
        safari.self.addEventListener('message', listener._listener);
      },
      removeListener: listener => {
        if (listener._listener) {
          safari.self.removeEventListener('message', listener._listener);
        }
      },
      sendMessage: message => {
        safari.self.tab.dispatchMessage('message', message);
      },
      sendMessageTo: (message, event) => {
        if (event.target.tab) {
          event.target.tab.dispatchMessage("message", message);
        } else {
          console.warn('event.target.tab is not exists');
        }
      }
    });

    super.initMessages();
  }
  initStorage() {
    this.storage = new Storage(new RemoteStorage());
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default SafariContentScriptMono;