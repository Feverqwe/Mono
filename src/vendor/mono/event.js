class Event {
  constructor() {
    this.listeners = [];
  }
  addListener(listener) {
    if (this.listeners.indexOf(listener) === -1) {
      this.listeners.push(listener);
    }
  }
  dispatch(...args) {
    this.listeners.forEach(listener => {
      listener(...args);
    });
  }
  hasListener(listener) {
    return this.listeners.indexOf(listener) !== -1;
  }
  hasListeners() {
    return this.listeners.length > 0;
  }
  removeListener(listener) {
    const pos = this.listeners.indexOf(listener);
    if (pos !== -1) {
      this.listeners.splice(pos, 1);
    }
  }
}

export default Event;