class UserscriptStorage {
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
      let existsKeys = GM_listValues();
      if (!keys) {
        keys = existsKeys;
      }
      if (!Array.isArray(keys)) {
        defaults = keys;
        keys = Object.keys(keys);
      }
      keys.forEach(key => {
        let exists = false;
        let value = null;
        try {
          if (existsKeys.indexOf(key) !== -1) {
            value = this.unwrapValue(GM_getValue(key));
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
        GM_setValue(key, this.wrapValue(items[key]));
      });
    });
  }
  remove(keys) {
    return Promise.resolve().then(() => {
      keys.forEach(key => {
        GM_deleteValue(key);
      });
    });
  }
  clear() {
    return Promise.resolve().then(() => {
      return this.remove(GM_listValues());
    });
  }
}

export default UserscriptStorage;