import Mono from "./mono";
import CallFnMixin from "./callFnMixin";

class ContentScriptMono extends CallFnMixin(Mono) {
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