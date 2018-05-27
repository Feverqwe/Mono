import Event from "./event";

class Mono {
  constructor(bundle) {
    this.bundle = bundle;
    this.transport = null;
    this.onDestroy = null;
    this.sendMessage = null;
    this.onMessage = null;
    this.storage = null;

    this.init();
  }
  initTransport() {
    throw new Error('initTransport error: not exists');
  }
  initStorage() {
    throw new Error('initStorage error: not exists');
  }
  init() {
    this.onDestroy = new Event();
    this.initTransport();
    this.sendMessage = this.transport.sendMessage.bind(this.transport);
    this.onMessage = {
      addListener: this.transport.addListener.bind(this.transport),
      hasListener: this.transport.hasListener.bind(this.transport),
      hasListeners: this.transport.hasListeners.bind(this.transport),
      removeListener: this.transport.removeListener.bind(this.transport),
    };
    this.initStorage();
  }
  destroy() {
    this.onDestroy.dispatch();
    this.transport.destroy();
  }
}

export default Mono;