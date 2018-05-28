class UserscriptStorage {
  get(defaults, callback) {
    const result = {};
    if (!defaults) {
      defaults = GM_listValues().reduce((obj, key) => {
        obj[key] = void 0;
        return obj;
      }, {});
    }
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