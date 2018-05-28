class UserscriptStorage {
  get(keys, callback) {
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
          value = GM_getValue(key, defaults[key]);
          exists = true;
        }
      } catch (err) {
        console.error('Parse key error', key);
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
  set(data, callback) {
    Object.keys(data).forEach(key => {
      GM_setValue(key, data[key]);
    });
    callback && callback();
  }
  remove(keys, callback) {
    keys.forEach(key => {
      GM_deleteValue(key);
    });
    callback && callback();
  }
  clear(callback) {
    this.remove(GM_listValues(), callback);
  }
}

export default UserscriptStorage;