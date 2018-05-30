class Event {
  constructor() {
    this.listeners = [];
  }
  /**
   * @param {function} listener
   */
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
  /**
   * @param {function} listener
   * @returns {boolean}
   */
  hasListener(listener) {
    return this.listeners.indexOf(listener) !== -1;
  }
  /**
   * @returns {boolean}
   */
  hasListeners() {
    return this.listeners.length > 0;
  }
  /**
   * @param {function} listener
   */
  removeListener(listener) {
    const pos = this.listeners.indexOf(listener);
    if (pos !== -1) {
      this.listeners.splice(pos, 1);
    }
  }
}

export default Event;