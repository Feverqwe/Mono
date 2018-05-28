import {wrapObjectValues, unwrapObjectValues} from "./warpObjectValues";

class Storage {
  constructor(api) {
    this.api = api;

    this.remote = {
      get: keys => {
        return new Promise(r => this.get(unwrapObjectValues(keys), r)).then(r => wrapObjectValues(r));
      },
      set: items => {
        return new Promise(r => this.set(unwrapObjectValues(items), r));
      },
      remove: keys => {
        return new Promise(r => this.remove(keys, r));
      },
      clear: () => {
        return new Promise(r => this.clear(r));
      }
    }
  };

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
      keys.forEach((obj, key) => {
        if (typeof key !== 'string') {
          throw new Error('Incorrect key type');
        }
      });
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