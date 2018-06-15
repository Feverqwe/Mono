import getStorageChanges from "./getStorageChanges";
import Event from "./event";
import {wrapObjectValues} from "./warpObjectValues";

class LsStorage {
  constructor(mono) {
    this.mono = mono;

    this.onChanged = new Event();

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
    const keys = Object.keys(items);
    this.get(keys, oldStorage => {
      keys.forEach(key => {
        localStorage.setItem(key, this.wrapValue(items[key]));
      });
      this.handleChange(oldStorage, items);
      callback && callback();
    });
  }
  remove(keys, callback) {
    this.get(keys, oldStorage => {
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
      this.handleChange(oldStorage, {});
      callback && callback();
    });
  }
  clear(callback) {
    this.get(Object.keys(localStorage), oldStorage => {
      localStorage.clear();
      this.handleChange(oldStorage, {});
      callback && callback();
    });
  }
}

export default LsStorage;