import Event from "./event";

const {EventEmitter} = require('events');

class Mono {
  constructor(bundle) {
    this.bundle = bundle;
    this.ee = new EventEmitter();
    this.onDestroy = new Event(this.ee, 'destroy');
    this.onMessage = new Event(this.ee, 'message');
  }
  sendMessage() {

  }
  destroy() {
    this.onDestroy.dispatch();
  }
}

export default Mono;