import Event from "./event";

class Mono {
  constructor() {
    this.onDestroy = new Event();

    this._lastErrorFired = false;
    this._lastError = null;
  }
  get lastError() {
    this._lastErrorFired = true;
    return this._lastError;
  }
  set lastError(error) {
    this._lastErrorFired = !error;
    this._lastError = error;
  }
  clearLastError() {
    if (this._lastError && !this._lastErrorFired) {
      console.error('Unhandled mono.lastError error:', this.lastError);
    }
    this._lastError = null;
  }
  unimplemented() {
    throw new Error('Unimplemented');
  }
  destroy() {
    this.onDestroy.dispatch();
  }
}

export default Mono;