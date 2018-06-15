import {wrapObjectValues, unwrapObjectValues} from "./warpObjectValues";

const StorageMixin = StorageApi => class extends StorageApi {
  constructor(mono) {
    super();

    this.mono = mono;

    this.remote = {
      get: keys => {
        return new Promise((resolve, reject) => this.get(unwrapObjectValues(keys), result => {
          const err = this.mono.lastError;
          err ? reject(err) : resolve(wrapObjectValues(result));
        }));
      },
      set: items => {
        return new Promise((resolve, reject) => this.set(unwrapObjectValues(items), () => {
          const err = this.mono.lastError;
          err ? reject(err) : resolve();
        }));
      },
      remove: keys => {
        return new Promise((resolve, reject) => this.remove(keys, () => {
          const err = this.mono.lastError;
          err ? reject(err) : resolve();
        }));
      },
      clear: () => {
        return new Promise((resolve, reject) => this.clear(() => {
          const err = this.mono.lastError;
          err ? reject(err) : resolve();
        }));
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
      keys.forEach(key => {
        if (typeof key !== 'string') {
          throw new Error('Incorrect key type');
        }
      });
    }
    if (typeof keys !== 'object') {
      throw new Error('Incorrect keys type');
    }
    super.get(keys, callback);
  }
  /**
   * @param {Object} items
   * @param {function} [callback]
   */
  set(items, callback) {
    super.set(items, callback);
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
    super.remove(keys, callback);
  }
  /**
   * @param {function} [callback]
   */
  clear(callback) {
    super.clear(callback);
  }
};

export default StorageMixin;