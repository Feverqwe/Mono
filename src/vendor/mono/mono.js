import Event from "./event";

class Mono {
  constructor() {
    this.onDestroy = new Event();
  }
  unimplemented() {
    throw new Error('Unimplemented');
  }
  destroy() {
    this.onDestroy.dispatch();
  }
}

export default Mono;