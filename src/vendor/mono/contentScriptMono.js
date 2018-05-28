import Mono from "./mono";
import ContentScriptCallFn from "./contentScriptCallFn";

class ContentScriptMono extends Mono {
  constructor(bundle) {
    super(bundle);
    this.contentScriptCallFn = null;
    this.callFn = null;

    this.initCallFn();
  }
  initCallFn() {
    this.contentScriptCallFn = new ContentScriptCallFn(this);
    this.callFn = this.contentScriptCallFn.callFn.bind(this.contentScriptCallFn);
  }
}

export default ContentScriptMono;