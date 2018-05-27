import Mono from "../../mono";
import Transport from "../../transport";

class UserscriptBackgroundPageMono extends Mono {
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

export default UserscriptBackgroundPageMono;