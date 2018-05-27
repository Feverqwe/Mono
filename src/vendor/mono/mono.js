import Event from "./event";

const {EventEmitter} = require('events');

class Mono {
  constructor(bundle) {
    this.bundle = bundle;
    this.ee = new EventEmitter();
    this.transport = null;
    this.onDestroy = null;
    this.sendMessage = null;
    this.onMessage = null;

    this.init();
  }
  initTransport() {
    throw new Error('initTransport error: not exists');
  }
  init() {
    this.onDestroy = new Event(this.ee, 'destroy');
    this.initTransport();
    this.sendMessage = this.transport.sendMessage.bind(this.transport);
    this.onMessage = {
      addListener: this.transport.addListener.bind(this.transport),
      hasListener: this.transport.hasListener.bind(this.transport),
      hasListeners: this.transport.hasListeners.bind(this.transport),
      removeListener: this.transport.removeListener.bind(this.transport),
    };
  }
  destroy() {
    this.onDestroy.dispatch();
    this.transport.destroy();
  }
}

export default Mono;