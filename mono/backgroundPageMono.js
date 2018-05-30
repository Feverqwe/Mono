import Mono from "./mono";
import BackgroundPageCallFn from "./backgroundPageCallFn";
import PageMonoMixin from "./pageMonoMixin";

class BackgroundPageMono extends PageMonoMixin(Mono) {
  initMessages() {
    super.initMessages();

    this.backgroundPageCallFn = new BackgroundPageCallFn(this);
    this.remote = this.backgroundPageCallFn.remote;

    this.readyPromise = Promise.resolve();
  }
  openTab(url, active) {
    this.unimplemented();
  }
  async() {
    let handleResolve = null;
    this.readyPromise = new Promise(resolve => handleResolve = resolve);
    return handleResolve;
  }
}

export default BackgroundPageMono;