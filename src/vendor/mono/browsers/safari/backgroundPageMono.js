import BackgroundPageMono from "../../backgroundPageMono";
import initPageTransport from "./initPageTransport";
import Storage from "../../storage";
import LsStorage from "../../lsStorage";

class SafariBackgroundPageMono extends BackgroundPageMono {
  constructor() {
    super();

    this.initMessages();
    this.initStorage();
  }
  initMessages() {
    this.transport = initPageTransport();

    super.initMessages(this.transport);
  }
  initStorage() {
    this.storage = new Storage(new LsStorage());
  }
  destroy() {
    super.destroy();
    this.transport.destroy();
  }
}

export default SafariBackgroundPageMono;