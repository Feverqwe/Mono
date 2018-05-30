class LsStorage {
  wrapValue(value) {
    return JSON.stringify({j:value});
  }
  unwrapValue(value) {
    return JSON.parse(value).j;
  }
  get(keys, callback) {
    const result = {};
    let defaults = {};
    if (!keys) {
      keys = Object.keys(localStorage);
    }
    if (!Array.isArray(keys)) {
      defaults = keys;
      keys = Object.keys(keys);
    }
    keys.forEach(key => {
      let exists = false;
      let value = null;
      try {
        if (localStorage.hasOwnProperty(key)) {
          value = this.unwrapValue(localStorage.getItem(key));
          exists = true;
        }
      } catch (err) {
        console.error(`Parse key (${key}) error`);
      }
      if (!exists && defaults.hasOwnProperty(key)) {
        value = defaults[key];
        exists = true;
      }
      if (exists) {
        result[key] = value;
      }
    });
    callback(result);
  }
  set(items, callback) {
    Object.keys(items).forEach(key => {
      localStorage.setItem(key, this.wrapValue(items[key]));
    });
    callback && callback();
  }
  remove(keys, callback) {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    callback && callback();
  }
  clear(callback) {
    localStorage.clear();
    callback && callback();
  }
}

export default LsStorage;