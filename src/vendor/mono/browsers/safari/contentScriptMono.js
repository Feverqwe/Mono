import Transport from "../../transport";
import ContentScriptMono from "../../contentScriptMono";
import Storage from "../../storage";
import RemoteStorage from "../../remoteStorage";

class SafariContentScriptMono extends ContentScriptMono {
  constructor(bundle) {
    super(bundle);
  }
  initTransport() {
    this.transport = new Transport({
      addListener: () => {},
      removeListener: () => {},
      sendMessage: () => {},
    });
  }
  initStorage() {
    this.storage = new Storage(new RemoteStorage());
  }
}

export default SafariContentScriptMono;