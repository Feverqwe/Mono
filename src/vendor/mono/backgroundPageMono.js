import Mono from "./mono";
import BackgroundPageCallFn from "./backgroundPageCallFn";
import PageMonoMixin from "./pageMonoMixin";

const notImplemented = () => {
  throw new Error('Unimplemented api');
};

class BackgroundPageMono extends PageMonoMixin(Mono) {
  initMessages() {
    super.initMessages();

    this.backgroundPageCallFn = new BackgroundPageCallFn(this);
    this.remote = this.backgroundPageCallFn.remote;
  }
  openTab(url, active) {
    notImplemented();
  }
}

export default BackgroundPageMono;