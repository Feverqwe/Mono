import UserscriptPageMono from "./pageMono";
import BackgroundPageCallFn from "../../backgroundPageCallFn";

class UserscriptBackgroundPageMono extends UserscriptPageMono {
  constructor(bundle) {
    super(bundle);
    this.backgroundPageCallFn = null;
    this.remote = null;

    this.initCallFn();
  }
  initCallFn() {
    this.backgroundPageCallFn = new BackgroundPageCallFn(this);
    this.remote = this.backgroundPageCallFn.remote;
  }
}

export default UserscriptBackgroundPageMono;