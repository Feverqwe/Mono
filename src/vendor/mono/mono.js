import Event from "./event";

class Mono {
  constructor() {
    this.onDestroy = new Event();
  }
  destroy() {
    this.onDestroy.dispatch();
  }
}

export default Mono;