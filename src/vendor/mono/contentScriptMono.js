import Mono from "./mono";
import ContentScriptCallFn from "./contentScriptCallFn";

class ContentScriptMono extends Mono {
  constructor(...args) {
    super(...args);
    this.contentScriptCallFn = null;
    this.callFn = null;
  }
  init() {
    super.init();
    this.contentScriptCallFn = new ContentScriptCallFn(this);
    this.callFn = this.contentScriptCallFn.callFn.bind(this.contentScriptCallFn);
  }
}

export default ContentScriptMono;