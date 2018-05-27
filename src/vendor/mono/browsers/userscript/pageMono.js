import Mono from "../../mono";
import Transport from "../../transport";

class UserscriptPageMono extends Mono {
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

export default UserscriptPageMono;