class Storage {
  constructor(api) {
    this.api = api;
  }
  /**
   * @param {Object|string|[string]|null|undefined} [keys]
   * @param {function} callback
   */
  get(keys, callback) {
    if (typeof keys === "undefined") {
      keys = null;
    }
    if (typeof keys === 'string') {
      keys = [keys];
    }
    if (Array.isArray(keys)) {
      keys = keys.reduce((obj, key) => {
        if (typeof key !== 'string') {
          throw new Error('Incorrect key type');
        }
        obj[key] = void 0;
        return obj;
      }, {});
    }
    if (typeof keys !== 'object') {
      throw new Error('Incorrect keys type');
    }
    this.api.get(keys, callback);
  }
  /**
   * @param {Object} items
   * @param {function} [callback]
   */
  set(items, callback) {
    this.api.set(items, callback);
  }
  /**
   * @param {String|[String]} [keys]
   * @param {function} [callback]
   */
  remove(keys, callback) {
    if (typeof keys === 'string') {
      keys = [keys];
    }
    keys.forEach(key => {
      if (typeof key !== 'string') {
        throw new Error('Incorrect key type');
      }
    });
    this.api.remove(keys, callback);
  }
  /**
   * @param {function} [callback]
   */
  clear(callback) {
    this.api.clear(callback);
  }
}

export default Storage;