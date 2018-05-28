import Transport from "../../transport";
import ContentScriptMono from "../../contentScriptMono";
import Storage from "../../storage";
import RemoteStorage from "../../remoteStorage";

class SafariContentScriptMono extends ContentScriptMono {
  initTransport() {
    this.transport = new Transport({
      addListener: listener => {
        listener._listener = event => listener(event.message);
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
        if (event.target.page) {
          event.target.page.dispatchMessage("message", message);
        } else {
          console.warn('event.target.page is not exists');
        }
      }
    });
  }
  initStorage() {
    this.storage = new Storage(new RemoteStorage());
  }
}

export default SafariContentScriptMono;