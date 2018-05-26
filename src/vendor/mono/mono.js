import Event from "./event";

const {EventEmitter} = require('events');

class Mono {
  constructor(bundle) {
    this.bundle = bundle;
    this.ee = new EventEmitter();
    this.onDestroy = new Event(this.ee, 'destroy');
  }
  destroy() {
    this.onDestroy.dispatch();
  }
}

export default Mono;