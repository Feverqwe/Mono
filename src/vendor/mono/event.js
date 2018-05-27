class Event {
  constructor(ee, eventName) {
    this.ee = ee;
    this.eventName = eventName;
  }
  addListener(listener) {
    this.ee.addListener(this.eventName, listener);
  }
  dispatch(...args) {
    this.ee.emit(this.eventName, ...args);
  }
  hasListener(listener) {
    return this.ee.listeners(this.eventName).indexOf(listener) !== -1;
  }
  hasListeners() {
    return this.ee.listenerCount(this.eventName) > 0;
  }
  removeListener(listener) {
    this.ee.removeListener(this.eventName, listener);
  }
}

export default Event;