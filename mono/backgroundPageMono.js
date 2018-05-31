import Mono from "./mono";
import PageMonoMixin from "./pageMonoMixin";
import CallFnListenerMixin from "./callFnListenerMixin";
import BackgroundPageApiMixin from "./backgroundPageApiMixin";

class BackgroundPageMono extends BackgroundPageApiMixin(CallFnListenerMixin(PageMonoMixin(Mono))) {
  constructor() {
    super();
    this.readyPromise = Promise.resolve();
  }
  async() {
    let handleResolve = null;
    this.readyPromise = new Promise(resolve => handleResolve = resolve);
    return handleResolve;
  }
}

export default BackgroundPageMono;