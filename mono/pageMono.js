import Mono from "./mono";
import ContentScriptCallFn from "./contentScriptCallFn";
import PageMonoMixin from "./pageMonoMixin";

class PageMono extends PageMonoMixin(Mono) {
  initMessages() {
    super.initMessages();

    this.contentScriptCallFn = new ContentScriptCallFn(this);
    this.callFn = this.contentScriptCallFn.callFn.bind(this.contentScriptCallFn);
  }
}

export default PageMono;