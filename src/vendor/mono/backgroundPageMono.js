import Mono from "./mono";
import BackgroundPageCallFn from "./backgroundPageCallFn";

class BackgroundPageMono extends Mono {
  initMessages() {
    this.sendMessage = this.transport.sendMessage.bind(this.transport);
    this.sendMessageToActiveTab = this.transport.sendMessageToActiveTab.bind(this.transport);
    this.onMessage = {
      addListener: this.transport.addListener.bind(this.transport),
      hasListener: this.transport.hasListener.bind(this.transport),
      hasListeners: this.transport.hasListeners.bind(this.transport),
      removeListener: this.transport.removeListener.bind(this.transport),
    };

    this.backgroundPageCallFn = new BackgroundPageCallFn(this);
    this.remote = this.backgroundPageCallFn.remote;
  }
}

export default BackgroundPageMono;