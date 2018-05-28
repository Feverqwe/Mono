import BackgroundPageCallFn from "../../backgroundPageCallFn";
import SafariPageMono from "./pageMono";

class SafariBackgroundPageMono extends SafariPageMono {
  constructor() {
    super();
    this.backgroundPageCallFn = null;
    this.remote = null;

    this.initCallFn();
  }
  initCallFn() {
    this.backgroundPageCallFn = new BackgroundPageCallFn(this);
    this.remote = this.backgroundPageCallFn.remote;
  }
}

export default SafariBackgroundPageMono;