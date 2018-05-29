import Mono from "./mono";
import ContentScriptCallFn from "./contentScriptCallFn";

class PageMono extends Mono {
  initMessages() {
    this.sendMessage = this.transport.sendMessage.bind(this.transport);
    this.sendMessageToActiveTab = this.transport.sendMessageToActiveTab.bind(this.transport);
    this.onMessage = {
      addListener: this.transport.addListener.bind(this.transport),
      hasListener: this.transport.hasListener.bind(this.transport),
      hasListeners: this.transport.hasListeners.bind(this.transport),
      removeListener: this.transport.removeListener.bind(this.transport),
    };

    this.contentScriptCallFn = new ContentScriptCallFn(this);
    this.callFn = this.contentScriptCallFn.callFn.bind(this.contentScriptCallFn);
  }
}

export default PageMono;