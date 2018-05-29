import Storage from "../../storage";
import UserscriptStorage from "./userscriptStorage";
import PageMono from "../../pageMono";
import initPageTransport from "./initPageTransport";

class UserscriptPageMono extends PageMono {
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

export default UserscriptPageMono;