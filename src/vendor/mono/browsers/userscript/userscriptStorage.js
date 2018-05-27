class UserscriptStorage {
  get(defaults, callback) {
    const result = {};
    Object.keys(defaults).forEach(key => {
      let value = defaults[key];
      try {
        value = GM_getValue(key, defaults[key]);
      } catch (err) {
        console.error('Parse key error', key);
      }
      result[key] = value;
    });
    callback(result);
  }
  set(data, callback) {
    Object.keys(data).forEach(key => {
      GM_setValue(key, data[key]);
    });
    callback();
  }
  remove(keys, callback) {
    keys.forEach(key => {
      GM_deleteValue(key);
    });
    callback();
  }
  clear(callback) {
    this.remove(GM_listValues(), callback);
  }
}

export default UserscriptStorage;