import {wrapObjectValues, unwrapObjectValues} from "./warpObjectValues";

class Storage {
  constructor(api) {
    this.api = api;

    this.remote = {
      get: keys => {
        return this.get(unwrapObjectValues(keys)).then(r => wrapObjectValues(r));
      },
      set: items => {
        return this.set(unwrapObjectValues(items));
      },
      remove: keys => {
        return this.remove(keys);
      },
      clear: () => {
        return this.clear();
      }
    }
  };

  /**
   * @param {Object|string|[string]|null|undefined} [keys]
   * @return {Promise<Object>}
   */
  get(keys) {
    return Promise.resolve().then(() => {
      if (typeof keys === "undefined") {
        keys = null;
      }
      if (typeof keys === 'string') {
        keys = [keys];
      }
      if (Array.isArray(keys)) {
        keys.forEach(key => {
          if (typeof key !== 'string') {
            throw new Error('Incorrect key type');
          }
        });
      }
      if (typeof keys !== 'object') {
        throw new Error('Incorrect keys type');
      }
      return this.api.get(keys);
    });
  }
  /**
   * @param {Object} items
   * @return {Promise}
   */
  set(items) {
    return this.api.set(items);
  }
  /**
   * @param {String|[String]} [keys]
   * @return {Promise}
   */
  remove(keys) {
    return Promise.resolve().then(() => {
      if (typeof keys === 'string') {
        keys = [keys];
      }
      keys.forEach(key => {
        if (typeof key !== 'string') {
          throw new Error('Incorrect key type');
        }
      });
      return this.api.remove(keys);
    });
  }
  /**
   * @return {Promise}
   */
  clear() {
    return this.api.clear();
  }
}

export default Storage;