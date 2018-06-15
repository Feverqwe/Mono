import Event from "../../event";

class UserscriptStorage {
  constructor(mono) {
    this.mono = mono;

    this.onChanged = new Event();
  }
  handleChange(oldStorage, storage) {
    throw new Error('handleChange is not supported');
  }
  wrapValue(value) {
    return JSON.stringify({j:value});
  }
  unwrapValue(value) {
    return JSON.parse(value).j;
  }
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
    callback(result);
  }
  set(items, callback) {
    const keys = Object.keys(items);
    this.get(keys, oldStorage => {
      keys.forEach(key => {
        GM_setValue(key, this.wrapValue(items[key]));
      });
      this.handleChange(oldStorage, items);
      callback && callback();
    });
  }
  remove(keys, callback) {
    this.get(keys, oldStorage => {
      keys.forEach(key => {
        GM_deleteValue(key);
      });
      this.handleChange(oldStorage, {});
      callback && callback();
    });
  }
  clear(callback) {
    this.remove(GM_listValues(), callback);
  }
}

export default UserscriptStorage;