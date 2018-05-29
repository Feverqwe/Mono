import Storage from "../../storage";
import LsStorage from "../../lsStorage";
import PageMono from "../../pageMono";
import initPageTransport from "./initPageTransport";

class SafariPageMono extends PageMono {
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

export default SafariPageMono;