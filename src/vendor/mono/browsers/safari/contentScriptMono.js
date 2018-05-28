import Transport from "../../transport";
import ContentScriptMono from "../../contentScriptMono";

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
}

export default SafariContentScriptMono;