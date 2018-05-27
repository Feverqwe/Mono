import Mono from "../../mono";
import Transport from "../../transport";

class UserscriptContentScriptMono extends Mono {
  constructor(bundle) {
    super(bundle);
  }
  init() {
    this.transport = new Transport({
      addListener: () => {},
      removeListener: () => {},
      sendMessage: () => {},
    });
    super.init();
  }
}

export default UserscriptContentScriptMono;