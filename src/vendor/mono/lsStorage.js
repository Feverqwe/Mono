class LsStorage {
  wrapValue(value) {
    return JSON.stringify({j:value});
  }
  unwrapValue(value) {
    return JSON.parse(value).j;
  }
  get(keys) {
    return Promise.resolve().then(() => {
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
      return result;
    });
  }
  set(items) {
    return Promise.resolve().then(() => {
      Object.keys(items).forEach(key => {
        localStorage.setItem(key, this.wrapValue(items[key]));
      });
    });
  }
  remove(keys) {
    return Promise.resolve().then(() => {
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
    });
  }
  clear() {
    return Promise.resolve().then(() => {
      localStorage.clear();
    });
  }
}

export default LsStorage;