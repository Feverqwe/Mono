import Storage from "./storage";

class StorageLocal extends Storage {
  wrapValue(value) {
    return JSON.stringify({j:value});
  }
  unwrapValue(value) {
    return JSON.parse(value).j;
  }
  get(defaults, callback) {
    const result = {};
    if (!defaults) {
      defaults = Object.keys(localStorage).reduce((obj, key) => {
        obj[key] = void 0;
        return obj;
      }, {});
    }
    Object.keys(defaults).forEach(key => {
      let value = defaults[key];
      try {
        if (localStorage.hasOwnProperty(key)) {
          value = this.unwrapValue(localStorage.getItem(key));
        }
      } catch (err) {
        console.error('Parse key error', key);
      }
      result[key] = value;
    });
    callback(result);
  }
  set(data, callback) {
    Object.keys(data).forEach(key => {
      localStorage.setItem(key, this.wrapValue(data[key]));
    });
    callback();
  }
  remove(keys, callback) {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    callback();
  }
  clear(callback) {
    localStorage.clear();
    callback();
  }
}

export default StorageLocal;