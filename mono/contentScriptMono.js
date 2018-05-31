import Mono from "./mono";
import CallFnMixin from "./callFnMixin";
import ContentScriptApiMixin from "./contentScriptApiMixin";

class ContentScriptMono extends ContentScriptApiMixin(CallFnMixin(Mono)) {
  initMessages() {
    this.sendMessage = this.transport.sendMessage.bind(this.transport);
    this.onMessage = {
      addListener: this.transport.addListener.bind(this.transport),
      hasListener: this.transport.hasListener.bind(this.transport),
      hasListeners: this.transport.hasListeners.bind(this.transport),
      removeListener: this.transport.removeListener.bind(this.transport),
    };
  }
}

export default ContentScriptMono;