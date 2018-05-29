import BackgroundPageMono from "../../backgroundPageMono";
import UserscriptStorage from "./userscriptStorage";
import Storage from "../../storage";
import initPageTransport from "./initPageTransport";

class UserscriptBackgroundPageMono extends BackgroundPageMono {
  constructor(bundle) {
    super();
    this.bundle = bundle;

    this.initMessages();
    this.initStorage();
  }
  initMessages() {
    this.transport = initPageTransport(this);

    super.initMessages(this.transport);
  }
  initStorage() {
    this.storage = new Storage(new UserscriptStorage());
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default UserscriptBackgroundPageMono;