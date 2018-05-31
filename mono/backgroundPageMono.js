import Mono from "./mono";
import PageMonoMixin from "./pageMonoMixin";
import CallFnListenerMixin from "./callFnListenerMixin";

class BackgroundPageMono extends CallFnListenerMixin(PageMonoMixin(Mono)) {
  constructor() {
    super();
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