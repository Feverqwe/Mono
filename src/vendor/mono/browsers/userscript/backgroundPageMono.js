import UserscriptPageMono from "./pageMono";
import BackgroundPageCallFn from "../../backgroundPageCallFn";

class UserscriptBackgroundPageMono extends UserscriptPageMono {
  constructor(...args) {
    super(...args);
    this.backgroundPageCallFn = null;
    this.remote = null;
  }
  init() {
    super.init();
    this.backgroundPageCallFn = new BackgroundPageCallFn(this);
    this.remote = this.backgroundPageCallFn.remote;
  }
}

export default UserscriptBackgroundPageMono;