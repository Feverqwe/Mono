import ContentScriptMono from "../../contentScriptMono";
import Storage from "../../storage";
import RemoteStorage from "../../remoteStorage";

class SafariContentScriptPageMono extends ContentScriptMono {
  initTransport() {
  }
  initStorage() {
    this.storage = new Storage(new RemoteStorage());
  }
}

export default SafariContentScriptPageMono;