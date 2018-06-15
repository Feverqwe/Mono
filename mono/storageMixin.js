const StorageMixin = StorageApi => class extends StorageApi {
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